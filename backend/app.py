
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import stripe
import os
import json
from dotenv import load_dotenv
import tempfile
from werkzeug.utils import secure_filename
import pypdf
from llama import Llama
import docx

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Initialize the model
model = Llama()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/api/convert-file', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    source_format = request.form.get('sourceFormat')
    target_format = request.form.get('targetFormat')
    
    if not file or not source_format or not target_format:
        return jsonify({"error": "Missing parameters"}), 400
    
    try:
        # Create temp file
        temp_dir = tempfile.mkdtemp()
        filename = secure_filename(file.filename)
        filepath = os.path.join(temp_dir, filename)
        file.save(filepath)
        
        # PDF to Word conversion
        if source_format == 'pdf' and target_format == 'docx':
            # Extract text from PDF
            reader = pypdf.PdfReader(filepath)
            text_content = ""
            for page in reader.pages:
                text_content += page.extract_text() + "\n\n"
            
            # Create Word document
            doc = docx.Document()
            doc.add_paragraph(text_content)
            
            output_path = os.path.join(temp_dir, 'converted.docx')
            doc.save(output_path)
            
            return send_file(output_path, as_attachment=True, download_name="converted.docx")
        
        # Other conversion types would be implemented similarly
        
        return jsonify({"error": "Conversion not supported yet"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-flashcards', methods=['POST'])
def generate_flashcards():
    try:
        # Get request data
        data = request.json
        content = data.get('content')
        
        if not content:
            return jsonify({"error": "No content provided"}), 400
        
        # Use LLM to generate flashcards
        prompt = f"""Generate flashcards from the following content. 
        Format as a JSON array with question and answer pairs:
        
        {content}
        """
        
        result = model.generate(prompt)
        
        # Parse and return the flashcards
        try:
            # Extract JSON from response if needed
            flashcards = json.loads(result)
            return jsonify({"flashcards": flashcards})
        except:
            return jsonify({"error": "Failed to parse flashcards"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/create-checkout', methods=['POST'])
def create_checkout():
    try:
        data = request.json
        plan_id = data.get('planId')
        
        if not plan_id:
            return jsonify({"error": "Missing plan ID"}), 400
        
        # Set up price IDs (these would be from your Stripe dashboard)
        price_mapping = {
            'lite': os.getenv('STRIPE_LITE_PRICE_ID'),
            'pro': os.getenv('STRIPE_PRO_PRICE_ID')
        }
        
        if plan_id not in price_mapping:
            return jsonify({"error": "Invalid plan ID"}), 400
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            line_items=[{
                'price': price_mapping[plan_id],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.headers.get('Origin') + '/payment-success',
            cancel_url=request.headers.get('Origin') + '/plans',
        )
        
        return jsonify({"url": checkout_session.url})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/customer-portal', methods=['POST'])
def customer_portal():
    try:
        data = request.json
        customer_id = data.get('customerId')
        
        if not customer_id:
            return jsonify({"error": "Customer ID required"}), 400
            
        # Create customer portal session
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=request.headers.get('Origin') + '/plans',
        )
        
        return jsonify({"url": portal_session.url})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/check-subscription', methods=['POST'])
def check_subscription():
    try:
        data = request.json
        customer_id = data.get('customerId')
        
        if not customer_id:
            return jsonify({"error": "Customer ID required"}), 400
        
        # Get customer subscriptions
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status='active',
            limit=1
        )
        
        has_active_sub = len(subscriptions.data) > 0
        subscription_tier = None
        subscription_end = None
        
        if has_active_sub:
            subscription = subscriptions.data[0]
            subscription_end = subscription.current_period_end
            
            # Get price and determine tier
            price_id = subscription.items.data[0].price.id
            price = stripe.Price.retrieve(price_id)
            
            # Simple pricing logic
            if price.unit_amount <= 1000:
                subscription_tier = "lite"
            else:
                subscription_tier = "pro"
        
        return jsonify({
            "subscribed": has_active_sub,
            "subscription_tier": subscription_tier,
            "subscription_end": subscription_end
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

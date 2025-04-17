
from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import API blueprints
from backend.api.flashcard_generator import flashcard_bp
from backend.api.file_converter import converter_bp
from backend.api.infographic_generator import infographic_bp
from backend.api.payment import payment_bp

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(flashcard_bp, url_prefix='/api/flashcards')
app.register_blueprint(converter_bp, url_prefix='/api/converter')
app.register_blueprint(infographic_bp, url_prefix='/api/infographic')
app.register_blueprint(payment_bp, url_prefix='/api/payment')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

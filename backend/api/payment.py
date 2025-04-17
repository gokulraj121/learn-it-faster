
from flask import Blueprint, request, jsonify
import os
import stripe

payment_bp = Blueprint('payment', __name__)

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@payment_bp.route('/create-checkout', methods=['POST'])
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
            cancel_url=request.headers.get('Origin') + '/payment-canceled',
        )
        
        return jsonify({"url": checkout_session.url})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payment_bp.route('/customer-portal', methods=['POST'])
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

@payment_bp.route('/check-subscription', methods=['POST'])
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

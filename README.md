
# Toolkit Web Application

A web application that provides AI-powered tools including file conversion, flashcard generation, and PDF to infographic conversion.

## Features

- File Converter: Convert between PDF, Word, images and text formats
- Flashcard Generator: Transform PDF notes into interactive study flashcards
- PDF to Infographic: Turn PDFs into visual infographics
- Subscription Plans: Lite and Pro plans with different features
- Stripe Payment Integration: Secure payment processing

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Python (Flask)
- Authentication: Supabase Auth
- Payments: Stripe
- AI: Llama 3 for text processing

## Getting Started

### Frontend

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

### Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
```
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Create a `.env` file with your Stripe API keys:
```
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_LITE_PRICE_ID=price_your_lite_price_id
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
```

6. Run the Flask server:
```
flask run
```

## Subscription Management

The application offers two subscription tiers:

1. **Lite Plan ($10/month)**
   - 50 AI Credits per month
   - Support for 100+ languages
   - Custom watermark option
   - Standard email support

2. **Pro Plan ($20/month)**
   - 150 AI Credits per month
   - Support for 100+ languages
   - Custom watermark option
   - Up to 5 users per account
   - Priority email support

## Google Ads Integration

The application includes a dedicated section in the footer for displaying Google Ads.

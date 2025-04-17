
# Python Backend for Toolkit

This is the Python backend for the Toolkit web application, which provides AI-powered tools for document processing, flashcard generation, and infographic creation.

## Project Structure

```
backend/
├── api/
│   ├── flashcard_generator.py  # Flashcard generator endpoints
│   ├── file_converter.py       # File conversion endpoints
│   ├── infographic_generator.py # Infographic generator endpoints
│   └── payment.py              # Stripe payment endpoints
├── utils/
│   └── llm_service.py          # LLM integration service
├── app.py                      # Main application entry point
├── Dockerfile                  # Docker configuration
└── requirements.txt            # Python dependencies
```

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
```
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:
```
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_LITE_PRICE_ID=price_your_lite_price_id
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
HF_API_TOKEN=your_huggingface_token
```

5. Run the server:
```
flask run
```

The API will be available at http://localhost:5000

## Docker Deployment

To build and run using Docker:

```
docker build -t toolkit-backend .
docker run -p 5000:5000 toolkit-backend
```

## Available API Endpoints

### Flashcard Generator
- POST `/api/flashcards/generate-flashcards` - Generate flashcards from PDF documents

### File Converter
- POST `/api/converter/convert-file` - Convert between PDF, Word, and other formats

### Infographic Generator
- POST `/api/infographic/generate-infographic` - Generate infographics from documents or URLs

### Payment
- POST `/api/payment/create-checkout` - Create Stripe checkout session
- POST `/api/payment/customer-portal` - Access customer portal
- POST `/api/payment/check-subscription` - Check subscription status

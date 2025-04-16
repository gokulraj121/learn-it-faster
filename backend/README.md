
# Python Backend for Toolkit

This is the Python backend for the Toolkit web application.

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
```

5. Run the server:
```
flask run
```

The API will be available at http://localhost:5000

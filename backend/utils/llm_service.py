
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LlamaModel:
    def __init__(self):
        # Use provided Gemini API Key
        self.api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyDGtUA1BNzNjxFcASfi5nHY7Y-lXZ1pvNM')
        self.api_url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
        self.headers = {
            "Content-Type": "application/json",
        }

    def generate(self, prompt, max_tokens=2000, temperature=0.2):
        """
        Generate text using the Gemini model
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature
            
        Returns:
            str: The generated text
        """
        try:
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "maxOutputTokens": max_tokens,
                    "temperature": temperature,
                    "topP": 0.95,
                }
            }
            
            # Add API key as a query parameter
            url = f"{self.api_url}?key={self.api_key}"
            
            response = requests.post(url, headers=self.headers, json=payload)
            
            if response.status_code != 200:
                print(f"API request failed with status {response.status_code}")
                print(f"Response: {response.text}")
                return f"Error: API request failed with status {response.status_code}"
            
            result = response.json()
            
            # Extract the generated text from Gemini's response format
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if len(parts) > 0 and "text" in parts[0]:
                        return parts[0]["text"]
            
            print(f"Unexpected API response format: {result}")
            return "Error: Unexpected API response format"
                
        except Exception as e:
            print(f"Error in LLM request: {e}")
            return f"Error generating text: {str(e)}"

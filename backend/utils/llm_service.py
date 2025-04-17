
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LlamaModel:
    def __init__(self):
        self.api_key = os.getenv('HF_API_TOKEN', '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')
        self.api_url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8b-chat-hf"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def generate(self, prompt, max_tokens=2000, temperature=0.2):
        """
        Generate text using the Llama 3 model
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature
            
        Returns:
            str: The generated text
        """
        try:
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "top_p": 0.95,
                    "do_sample": True,
                },
                "options": {
                    "wait_for_model": True,
                },
            }
            
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            
            if response.status_code != 200:
                print(f"API request failed with status {response.status_code}")
                print(f"Response: {response.text}")
                return f"Error: API request failed with status {response.status_code}"
            
            result = response.json()
            
            # Extract the generated text
            if "generated_text" in result:
                return result["generated_text"]
            elif isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
                return result[0]["generated_text"]
            else:
                print(f"Unexpected API response format: {result}")
                return "Error: Unexpected API response format"
                
        except Exception as e:
            print(f"Error in LLM request: {e}")
            return f"Error generating text: {str(e)}"

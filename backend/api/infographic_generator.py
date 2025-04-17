
from flask import Blueprint, request, jsonify
import json
import tempfile
import os
from werkzeug.utils import secure_filename
import pypdf
import requests
from backend.utils.llm_service import LlamaModel

infographic_bp = Blueprint('infographic', __name__)
llm = LlamaModel()

@infographic_bp.route('/generate-infographic', methods=['POST'])
def generate_infographic():
    try:
        # Handle different input types
        if 'file' in request.files:
            # Process uploaded PDF
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
                
            filename = secure_filename(file.filename)
            
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            filepath = os.path.join(temp_dir, filename)
            file.save(filepath)
            
            # Extract text from PDF
            if filename.lower().endswith('.pdf'):
                reader = pypdf.PdfReader(filepath)
                content = ""
                for page in reader.pages:
                    content += page.extract_text() + "\n\n"
            else:
                return jsonify({"error": "Unsupported file format"}), 400
                
        elif 'url' in request.json:
            # Process URL - In a production app, you'd fetch and extract content from the URL
            url = request.json.get('url')
            try:
                # Basic URL validation
                if not url.startswith(('http://', 'https://')):
                    return jsonify({"error": "Invalid URL format"}), 400
                    
                # For a real implementation, we'd fetch and parse the URL content
                # Here we're just simulating it
                content = f"Content extracted from {url}"
                filename = "url_content"
            except Exception as e:
                return jsonify({"error": f"Failed to fetch URL: {str(e)}"}), 400
                
        elif 'content' in request.json:
            # Process direct text content
            content = request.json.get('content')
            filename = request.json.get('filename', 'document')
        else:
            return jsonify({"error": "No input provided (file, URL, or content)"}), 400
            
        # Generate infographic content using LLM
        infographic_data = generate_infographic_with_llm(content, filename)
        
        return jsonify({
            "success": True,
            "infographic": infographic_data,
            "title": os.path.splitext(filename)[0] if isinstance(filename, str) else "Infographic"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_infographic_with_llm(content, filename):
    try:
        # Prepare prompt for infographic generation
        prompt = f"""
        I have the following document content:
        ---
        {content[:4000]}{"..." if len(content) > 4000 else ""}
        ---
        
        I want to create an infographic from this content. Please extract the most important information and structure it in a way that would work well for an infographic.
        
        Include the following elements:
        1. A short, catchy title
        2. 3-5 key points or sections with brief descriptions
        3. Important statistics or numbers if present
        4. A brief conclusion or takeaway
        
        Format your response as a JSON object with these sections. Make sure it's valid JSON.
        
        Example format:
        {{
          "title": "The Impact of Climate Change",
          "sections": [
            {{
              "heading": "Rising Global Temperatures",
              "content": "Average temperatures have increased by 1.1°C since pre-industrial times.",
              "icon": "thermometer"
            }},
            {{
              "heading": "Sea Level Rise",
              "content": "Global sea levels rose 8-9 inches since 1880, with the rate accelerating.",
              "icon": "wave"
            }}
          ],
          "statistics": [
            {{
              "value": "1.1°C",
              "label": "Global temperature increase"
            }},
            {{
              "value": "8-9 inches",
              "label": "Sea level rise since 1880"
            }}
          ],
          "conclusion": "Immediate action is needed to prevent catastrophic climate impacts."
        }}
        """
        
        # Generate infographic data using LLM
        result = llm.generate(prompt)
        
        # Parse the response to get the JSON
        try:
            # Try to find JSON in the response
            start_idx = result.find('{')
            end_idx = result.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = result[start_idx:end_idx]
                infographic_data = json.loads(json_str)
                return infographic_data
            else:
                # Fallback: create basic infographic structure
                return {
                    "title": f"Key Points from {filename}",
                    "sections": [
                        {
                            "heading": "Main Topic",
                            "content": content[:100] + "...",
                            "icon": "file-text"
                        }
                    ],
                    "statistics": [],
                    "conclusion": "See document for complete details."
                }
                
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            # Return basic structure if parsing fails
            return {
                "title": f"Summary of {filename}",
                "sections": [
                    {
                        "heading": "Document Overview",
                        "content": "This document contains important information.",
                        "icon": "file-text"
                    }
                ],
                "statistics": [],
                "conclusion": "Please review the full document for details."
            }
            
    except Exception as e:
        print(f"Error generating infographic: {e}")
        return {
            "title": "Error Processing Document",
            "sections": [
                {
                    "heading": "Error",
                    "content": "There was an error processing this document.",
                    "icon": "alert-circle"
                }
            ],
            "statistics": [],
            "conclusion": "Please try again with a different document."
        }

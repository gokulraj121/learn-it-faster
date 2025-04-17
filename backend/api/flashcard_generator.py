
from flask import Blueprint, request, jsonify
import json
from werkzeug.utils import secure_filename
import os
import tempfile
import pypdf
from backend.utils.llm_service import LlamaModel

flashcard_bp = Blueprint('flashcard', __name__)
llm = LlamaModel()

@flashcard_bp.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    try:
        # Check if file is in request
        if 'file' not in request.files and 'content' not in request.json:
            return jsonify({"error": "No file or content provided"}), 400
        
        content = ""
        filename = "document"
        
        # Process file if provided
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
                
            filename = secure_filename(file.filename)
            
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            filepath = os.path.join(temp_dir, filename)
            file.save(filepath)
            
            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                reader = pypdf.PdfReader(filepath)
                for page in reader.pages:
                    content += page.extract_text() + "\n\n"
            else:
                # For text files
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
        else:
            # Use provided content
            content = request.json.get('content', '')
            if 'filename' in request.json:
                filename = request.json.get('filename')
        
        # Generate flashcards using LLM
        flashcards = generate_flashcards_with_llm(content, filename)
        
        return jsonify({
            "success": True,
            "flashcards": flashcards,
            "title": os.path.splitext(filename)[0] if filename else "Study Notes"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_flashcards_with_llm(content, filename):
    try:
        # Create prompt for flashcard generation
        prompt = f"""
        I have the following document content:
        ---
        {content[:4000]}{"..." if len(content) > 4000 else ""}
        ---
        
        Please create 10 useful flashcards from this content. Each flashcard should have a specific question and a comprehensive answer that helps with studying this material.
        
        The questions should cover key concepts, definitions, facts, and important points from the content.
        The answers should be detailed but concise, complete sentences that fully address the question.
        
        Format the response as a JSON array with objects that have "question" and "answer" properties. ONLY return the JSON array without any other text.
        
        Example format:
        [
          {
            "question": "What is the capital of France?",
            "answer": "The capital of France is Paris."
          },
          {
            "question": "When did World War II end?",
            "answer": "World War II ended in 1945 with the surrender of Germany in May and Japan in September."
          }
        ]
        """
        
        # Generate flashcards using LLM
        result = llm.generate(prompt)
        
        # Parse the response to get the JSON array
        try:
            # Try to find JSON in the response
            start_idx = result.find('[')
            end_idx = result.rfind(']') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = result[start_idx:end_idx]
                flashcards = json.loads(json_str)
                return flashcards
            else:
                # Fallback: create basic flashcards from content
                sentences = content.replace('\n', ' ').split('.')
                flashcards = []
                
                for i, sentence in enumerate(sentences[:10]):
                    if len(sentence.strip()) > 20:
                        words = sentence.strip().split()
                        if len(words) < 5:
                            continue
                            
                        # Create a simple question
                        question = f"Complete the following: {' '.join(words[:len(words)//2])}..."
                        answer = sentence.strip()
                        
                        flashcards.append({
                            "question": question,
                            "answer": answer
                        })
                
                return flashcards
                
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            # Return empty array if parsing fails
            return []
            
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        return []

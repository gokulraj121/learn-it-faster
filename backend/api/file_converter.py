
from flask import Blueprint, request, jsonify, send_file
import os
import tempfile
from werkzeug.utils import secure_filename
import pypdf
import docx
from backend.utils.llm_service import LlamaModel

converter_bp = Blueprint('converter', __name__)
llm = LlamaModel()

@converter_bp.route('/convert-file', methods=['POST'])
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
            
        # Word to PDF conversion
        elif source_format == 'docx' and target_format == 'pdf':
            # For a real implementation, we'd use a library like docx2pdf
            # Here we're just returning a simple text file with an error message
            output_path = os.path.join(temp_dir, 'error.txt')
            with open(output_path, 'w') as f:
                f.write("This conversion is not fully implemented yet.")
            
            return send_file(output_path, as_attachment=True, download_name="conversion_note.txt")
        
        # Image to text conversion (OCR)
        elif 'image' in source_format and target_format == 'txt':
            # Use LLM to extract text from image
            with open(filepath, 'rb') as f:
                image_data = f.read()
            
            # For a real implementation, we'd use a proper OCR library
            # Here we're just returning a simple text file
            output_path = os.path.join(temp_dir, 'extracted_text.txt')
            with open(output_path, 'w') as f:
                f.write("Text extraction would happen here in production.")
            
            return send_file(output_path, as_attachment=True, download_name="extracted_text.txt")
        
        # Other conversions
        else:
            return jsonify({"error": "Conversion not supported yet"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

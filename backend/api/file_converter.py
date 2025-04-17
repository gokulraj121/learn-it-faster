
from flask import Blueprint, request, jsonify, send_file, Response
import os
import tempfile
from werkzeug.utils import secure_filename
import pypdf
import docx
import json
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
            
            return send_file(output_path, 
                             as_attachment=True, 
                             download_name="converted.docx", 
                             mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            
        # Word to PDF conversion
        elif source_format == 'docx' and target_format == 'pdf':
            # For demonstration, returning text since PDF creation requires additional libraries
            output_path = os.path.join(temp_dir, 'conversion_note.txt')
            with open(output_path, 'w') as f:
                f.write("This is a placeholder for the PDF conversion. In production, this would be a PDF file.")
            
            return send_file(output_path, 
                             as_attachment=True, 
                             download_name="converted.pdf", 
                             mimetype="application/pdf")
        
        # Image to text conversion (OCR)
        elif 'image' in source_format and target_format == 'txt':
            # Use LLM to extract text from image
            extracted_text = "This is placeholder text from OCR conversion. In production, this would contain the extracted text from your image."
            
            return Response(extracted_text, 
                           mimetype="text/plain",
                           headers={"Content-Disposition": "attachment;filename=extracted_text.txt"})
        
        # PDF to text conversion
        elif source_format == 'pdf' and target_format == 'txt':
            # Extract text from PDF
            reader = pypdf.PdfReader(filepath)
            text_content = ""
            for page in reader.pages:
                text_content += page.extract_text() + "\n\n"
            
            return Response(text_content, 
                           mimetype="text/plain",
                           headers={"Content-Disposition": "attachment;filename=extracted_text.txt"})
        
        # Other conversions
        else:
            return jsonify({"error": "Conversion not supported yet"}), 400
    
    except Exception as e:
        print(f"Error in file conversion: {str(e)}")
        return jsonify({"error": str(e)}), 500

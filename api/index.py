from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import io
from imagetodatabase import generate_commentary  # Assuming you have the generate_commentary function

app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"


# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Flask route to handle image uploads
@app.route('/api/upload', methods=['POST'])
async def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        # Read the image file into a PIL Image
        try:
            image = Image.open(file)
            image_data = io.BytesIO()
            image.save(image_data, format=image.format)
            image_data = image_data.getvalue()
            width, height = image.size

            # Process the image and generate commentary
            result = await generate_commentary(image_data, width, height)

            return jsonify({
                'timestamp': result['timestamp'],
                'commentary': result['text'],
                'embedding': result['embedding']
            }), 200

        except Exception as e:
            return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

    return jsonify({'error': 'Allowed file types are png, jpg, jpeg, gif'}), 400

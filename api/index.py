from datetime import datetime
import json
import os
import tempfile
from flask import Flask, request, jsonify, send_file
import requests
from werkzeug.utils import secure_filename
from PIL import Image
import io
from imagetodatabase import generate_commentary  # Assuming you have the generate_commentary function
from groqclient import generate_embedding, get_similar_contents, get_response, initialize_database
from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)
from dotenv import load_dotenv
load_dotenv()

from groqclient import get_similar_contents, get_response
from cartesia_client import speak

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
    print(request)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        # Read the image file into a PIL Image
        image = Image.open(file)
        image_data = io.BytesIO()
        image.save(image_data, format=image.format)
        image_data = image_data.getvalue()
        width, height = image.size

        # Process the image and generate commentary
        result = await generate_commentary(image_data, width, height)

        return jsonify({
            'timestamp': result['timestamp'],
            'description': result['text'],
        }), 200

    return jsonify({'error': 'Allowed file types are png, jpg, jpeg, gif'}), 400



@app.route('/api/getanswerinaudio', methods=['POST'])
async def get_context():
    data = request.get_json()

    # Extract the 'question' argument from the JSON body
    question = data.get('question')

    # Check if 'question' is provided
    if not question:
        return jsonify({"error": "Question not provided"}), 400

    contents = get_similar_contents(question)
    print(contents)

    ans = get_response(question, contents["similars"])
    audio_file = speak(ans["description"])

    return send_file(audio_file, mimetype='audio/wav', as_attachment=True, download_name='response.wav')
    

@app.route('/api/getanswerintext', methods=['POST'])
async def answer_in_text():
    data = request.get_json()

    # Extract the 'question' argument from the JSON body
    question = data.get('question')

    # Check if 'question' is provided
    if not question:
        return jsonify({"error": "Question not provided"}), 400

    contents = get_similar_contents(question)
    print(contents)

    ans = get_response(question, contents["similars"])
    return ans


deepgram = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
@app.route('/api/uploadaudio', methods=['POST'])
def upload_audio():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        # Create a temporary file to store the audio data
        with tempfile.NamedTemporaryFile(delete=True) as temp_file:
            # Save the uploaded file to the temporary file
            uploaded_file.save(temp_file.name)

            # Read the temporary file data into memory
            with open(temp_file.name, "rb") as file:
                buffer_data = file.read()

            # Prepare the Deepgram payload
            payload: FileSource = {
                "buffer": buffer_data,
            }

            # Set transcription options
            options = PrerecordedOptions(
                model="nova-2",  # Using the 'nova-2' model
                smart_format=True,  # Enable smart formatting
            )

            # Make the request to Deepgram API for transcription
            response = deepgram.listen.rest.v("1").transcribe_file(payload, options)
            response = response['results']['channels'][0]['alternatives'][0]['transcript']
            # Return the transcription response as JSON


            embedding = generate_embedding(response)
            print("Generated embedding:", "Embedding generated successfully")
            timestamp = datetime.now()
            print(timestamp, response)
            conn, cursor = initialize_database()
            if cursor:
                cursor.execute('''INSERT INTO descriptions_table (timestamp, description, embedding) 
                                    VALUES (%s, %s, %s)''',
                                (timestamp, response, json.dumps(embedding.tolist())))
                conn.commit()


            return {"transcription":response}

    else:
        return jsonify({'error': 'No file uploaded'}), 400
    


@app.route('/api/create_voice', methods=['POST'])
def create_voice():
    # Check if 'clip' is in the request files
    if 'file' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400
    
    # Get the file from the request
    file = request.files['file']
    
    # Optional: Check if a name was provided in the JSON data
    name = request.form.get('name', 'default_name')

    try:
        # Clone Voice from Clip (POST /voices/clone/clip)
        response = requests.post(
            "https://api.cartesia.ai/voices/clone/clip",
            headers={
                "X-API-Key": os.getenv("CARTESIA_API_KEY"),
                "Cartesia-Version": "2024-06-10",
            },
            data={
                'enhance': json.dumps(True),
            },
            files={
                'clip': (file.filename, file.stream, 'audio/wav')  # Use the file from the request
            },
        )

        # Check for success and extract embedding
        if response.status_code == 200:
            embeddings = response.json().get('embedding')

    except Exception as e:
        print("Error: ", e)

    # Create Voice (POST /voices/)
    responseCreate = requests.post(
        "https://api.cartesia.ai/voices",
        headers={
            "X-API-Key": os.getenv("CARTESIA_API_KEY"),
            "Cartesia-Version": "2024-06-10",
            "Content-Type": "application/json"
        },
        json={
            "name": name,
            "description": name,
            "embedding": embeddings,
            "language": "en"
        },
    )

    id = responseCreate.json()['id']
    print(id)
    print('HELLLLL')
    url = "https://api.vapi.ai/assistant/2ff538ce-29cb-4f73-af80-495559c5865c"

    payload = {"voice": {
            "provider": "cartesia",
            "voiceId": id
        }}
    headers = {
        "Authorization": 'Bearer ' + os.getenv("VAPI_KEY"),
        "Content-Type": "application/json"
    }
    response = requests.request("PATCH", url, json=payload, headers=headers)
    print(response)
    print(response.json())
    print(response.text)

    return 'Voice ID successfully changed !'
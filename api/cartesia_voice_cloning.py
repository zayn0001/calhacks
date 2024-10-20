import os
from flask import send_file
import requests
import json
from dotenv import load_dotenv
import base64
import wave
import numpy as np
from cartesia import Cartesia
import ffmpeg
import tempfile
import time
from flask import Flask, request, jsonify, send_file
load_dotenv()


app = Flask(__name__)

def speak(content, id):
    try:
        os.remove("/tmp/sample_.wav")
    except:
        pass
    client = Cartesia(api_key=os.getenv("CARTESIA_API_KEY"))
    voice_id = id  # Barbershop Man
    model_id = "sonic-english"
    transcript = content
    output_format = {
        "container": "raw",
        "encoding": "pcm_f32le",
        "sample_rate": 44100,
    }
    print('check')
    # Set up a WebSocket connection.
    ws = client.tts.websocket()
    
    # Create temporary files for PCM and WAV
    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as pcm_file:
        pcm_file_name = pcm_file.name
        with open(pcm_file_name, "wb") as f:
            for output in ws.send(
                model_id=model_id,
                transcript=transcript,
                voice_id=voice_id,
                stream=True,
                output_format=output_format,
            ):
                buffer = output["audio"]  # buffer contains raw PCM audio bytes
                f.write(buffer)
    
    ws.close()

    # Run the conversion
    ffmpeg.input(pcm_file_name, format="f32le").output("/tmp/sample_.wav").run()

    # Return the path of the WAV file
    # return send_file("/tmp/sample_.wav", mimetype='audio/wav', as_attachment=True, download_name='response.wav')
    
    return "/tmp/sample_.wav"

# speak("Hi this is Swapnil")



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
    time.sleep(3)
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
    # ids = [x['id'] for x in response.json() if x['name'] == name]
    # if len(ids) > 0:

    # for x in response.json():
    #     print(x['name'], ': ',  x['id'])

if __name__ == '__main__':
    app.run(port=5002, debug=True)

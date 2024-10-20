import requests
from dotenv import load_dotenv
import os
import os
import subprocess
import ffmpeg
import tempfile
from cartesia import Cartesia
load_dotenv()

def speak(content):
    try:
        os.remove("/tmp/sample_.wav")
    except:
        pass
    client = Cartesia(api_key=os.getenv("CARTESIA_API_KEY"))
    voice_id = "a0e99841-438c-4a64-b679-ae501e7d6091"  # Barbershop Man
    model_id = "sonic-english"
    transcript = content
    output_format = {
        "container": "raw",
        "encoding": "pcm_f32le",
        "sample_rate": 44100,
    }

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
    ffmpeg.input(pcm_file_name, format="f32le").output("sample_.wav").run()

    # Return the path of the WAV file
    return "/tmp/sample_.wav"
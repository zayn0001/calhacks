import json
import time
import requests
from datetime import datetime
import singlestoredb as s2
from sentence_transformers import SentenceTransformer
import numpy as np
import os
from dotenv import load_dotenv
load_dotenv()

# Load a pre-trained sentence transformer model (for embeddings)
# Here, we use a model compatible with Groq hardware inference
# Replace 'all-MiniLM-L6-v2' with a model optimized for Groq if needed
model = SentenceTransformer('all-MiniLM-L6-v2')

MAX_RETRIES = 3
RETRY_DELAY = 1  # 1 second

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SINGLESTORE_CONN_URI = os.getenv("SINGLESTORE_CONN_URI")

# Initialize SingleStore database and commentary table
def initialize_database():
    try:
        conn = s2.connect(
            SINGLESTORE_CONN_URI
        )
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS commentary_table (
                            timestamp DATETIME NOT NULL,
                            commentary TEXT NOT NULL,
                            embedding TEXT,
                            latency FLOAT,
                            win_probability FLOAT,
                            warriors_score FLOAT,
                            cavaliers_score FLOAT
                          )''')
        conn.commit()
        return conn, cursor
    except Exception as e:
        print(f"Error initializing the database: {e}")
        raise e

# Function to generate embedding using OpenAI or any embedding API
def generate_embedding(commentary_text):
    try:
        # Generate embedding for the input commentary
        embedding = model.encode(commentary_text)
        return embedding
    except Exception as error:
        print("Error generating embedding:", error)
        raise error

# Function to interact with Groq API and generate commentary
def generate_commentary_with_groq(encoded_image):
    retries = 0
    commentary_table = None

    # Initialize database and commentary table
    try:
        conn, cursor = initialize_database()
    except Exception as e:
        print(f"Error initializing the database: {e}")
        raise e

    while retries < MAX_RETRIES:
        try:
            print(f"Preparing request to Groq API (Attempt {retries + 1})")
            print(f"Encoded image length: {len(encoded_image)}")
            print(f"GROQ_API_KEY set: {bool(GROQ_API_KEY)}")

            headers = {'Authorization': f'Bearer {GROQ_API_KEY}'}
            data = {
                'messages': [
                    {
                        'role': 'user',
                        'content': [
                            {
                                'type': 'text',
                                'text': '''You are an expert NBA sports commentator API capable of basketball analysis that responds in JSON. 
                                The game score is in a box to the right of ESPN, with CLE showing the Cavaliers score and GS showing the Warriors score. 
                                The JSON schema should include:\n\n{\n  "commentary": str,\n  "win_probability_gs": int [0-100],\n  "current_gs_score": int,\n  
                                "current_cle_score": int,\n  "latency": float\n}'''
                            },
                            {
                                'type': 'image_url',
                                'image_url': {
                                    'url': encoded_image
                                }
                            }
                        ]
                    }
                ],
                'response_format': {'type': 'json_object'},
                'model': 'llama-3.2-11b-vision-preview',
                'max_tokens': 150,
                'temperature': 0
            }

            response = requests.post('https://api.groq.com/openai/v1/chat/completions', headers=headers, json=data)
            response.raise_for_status()
            chat_completion = response.json()
            parsed_content = json.loads(chat_completion['choices'][0]['message']['content'])

            commentary = parsed_content.get('commentary', 'No commentary generated.')
            win_probability = parsed_content.get('win_probability_gs', 50)
            warriors_score = parsed_content.get('current_gs_score', 0)
            cavaliers_score = parsed_content.get('current_cle_score', 0)
            latency = chat_completion.get('usage', {}).get('completion_time', 0)

            # Generate embedding
            embedding = generate_embedding(commentary)
            print("Generated embedding:", "Embedding generated successfully" if embedding else "Failed to generate embedding")

            # Insert data into SingleStore
            timestamp = datetime.now()

            if cursor:
                cursor.execute('''INSERT INTO commentary_table (timestamp, commentary, embedding, latency, win_probability, warriors_score, cavaliers_score) 
                                  VALUES (%s, %s, %s, %s, %s, %s, %s)''',
                               (timestamp, commentary, json.dumps(embedding), latency, win_probability, warriors_score, cavaliers_score))
                conn.commit()

            return {
                "commentary": commentary,
                "embedding": embedding,
                "winProbability": win_probability,
                "warriorsScore": warriors_score,
                "cavaliersScore": cavaliers_score,
                "latency": latency
            }
        except Exception as error:
            print(f"Error generating commentary with Groq (Attempt {retries + 1}): {error}")
            retries += 1
            if retries < MAX_RETRIES:
                print(f"Retrying in {RETRY_DELAY} second(s)...")
                time.sleep(RETRY_DELAY)

    return {
        "commentary": f"Error generating commentary after {MAX_RETRIES} attempts.",
        "embedding": None,
        "winProbability": None,
        "warriorsScore": None,
        "cavaliersScore": None,
        "latency": None
    }

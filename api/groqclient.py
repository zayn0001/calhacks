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
        cursor.execute('''CREATE TABLE IF NOT EXISTS descriptions_table (
                            timestamp DATETIME NOT NULL,
                            embedding VECTOR(384) NOT NULL,
                            description TEXT
                          )''')
        conn.commit()
        return conn, cursor
    except Exception as e:
        print(f"Error initializing the database: {e}")
        raise e

# Function to generate embedding using OpenAI or any embedding API
def generate_embedding(commentary_text):
    # Generate embedding for the input commentary
    print("Generating Embedding....")
    embedding = model.encode(commentary_text)
    return embedding

# Function to interact with Groq API and generate commentary
def generate_commentary_with_groq(encoded_image):
    retries = 0
    print(122)
    # Initialize database and commentary table
    conn, cursor = initialize_database()


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
                        'text': '''You are an ai assistant expert in describing the actions performed in any sort of image. Return a response of the description of what is happening in the image 
                        The JSON schema should include:\n\n{\n  "description": str,\n}'''
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
    print(response)
    response.raise_for_status()
    chat_completion = response.json()
    print(chat_completion)
    parsed_content = json.loads(chat_completion['choices'][0]['message']['content'])
    print(parsed_content)
    description = parsed_content.get('description', 'No commentary generated.')

    # Generate embedding
    embedding = generate_embedding(description)
    #print(embedding, type(embedding), embedding.shape)
    print("Generated embedding:", "Embedding generated successfully")

    # Insert data into SingleStore
    timestamp = datetime.now()
    print(timestamp, description)

    if cursor:
        cursor.execute('''INSERT INTO descriptions_table (timestamp, description, embedding) 
                            VALUES (%s, %s, %s)''',
                        (timestamp, description, json.dumps(embedding.tolist())))
        conn.commit()



    return {
        "timestamp": str(timestamp),
        "description": description,
        "embedding": json.dumps(embedding.tolist())
    }




def get_similar_contents(question):

    conn, cursor = initialize_database()


    embedding = generate_embedding(question)
    #print(embedding, type(embedding), embedding.shape)
    print("Generated embedding:", "Embedding generated successfully")
    print(json.dumps(embedding.tolist()).replace("[", "(").replace("]",")"))
    if cursor:
        # cursor.execute('''
        #                 SELECT description,
        #                     embedding <*> CAST(%s AS VECTOR(384)) AS score
        #                 FROM descriptions_table
        #                 ORDER BY score DESC
        #                 LIMIT 2;   
        #                ''',
        #                 (json.dumps(embedding.tolist()).replace("[", "(").replace("]",")")))
        
        cursor.execute('''
                    SET @query_vec = (%s):>VECTOR(384):>BLOB;
''', (json.dumps(embedding.tolist())))
        conn.commit()

        cursor.execute('''
                         SELECT description,
                             embedding <*> @query_vec AS score
                         FROM descriptions_table
                         ORDER BY score DESC
                         LIMIT 1;   
                        ''')
        conn.commit()
    
    return {
        "similars":cursor.fetchall()
    }
    

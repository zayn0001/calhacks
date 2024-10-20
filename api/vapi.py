import json
from fastapi import FastAPI, Request
from starlette.responses import StreamingResponse
from dotenv import load_dotenv
from groq import AsyncGroq
from groqclient import get_similar_contents
load_dotenv()

app = FastAPI()
client = AsyncGroq()

@app.post("/chat/completions")
async def chat_completion_stream(request: Request):
    print(request)
    data = await request.json()
    print(data)
    content = data['messages'][1]['content']
    similars = get_similar_contents(content)
    print(similars)
    context = similars["similars"][0][0]

    try:
        response = await client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content":  "You are an AI assistant that answers in past tense when answering questions regarding the information provided. Do not say anything like 'based on the information provided'. go straight to the answer. end the conversation after the first response"
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                'type': 'text',
                                'text': f'''
                                            question: {content}
                                            information: {context}
                                        '''
                            }
                        ]
                    }
                ],
                model="llama3-8b-8192",
                temperature=0.5,
                max_tokens=1024,
                top_p=1,
                stop=None,
                stream=True,
            )

        async def event_stream():
            try:
                async for chunk in response:
                    yield f"data: {json.dumps(chunk.model_dump())}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                print(f"Error during response streaming: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingResponse(event_stream(), media_type="text/event-stream")

    except Exception as e:
        print("nooooosdijhjhgfshjgb")
        return StreamingResponse(
            f"data: {json.dumps({'error': str(e)})}\n\n", media_type="text/event-stream"
        )
    
# Run FastAPI on port 5001
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=5001, log_level="debug")
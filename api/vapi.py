import json
from fastapi import FastAPI, Request
from starlette.responses import StreamingResponse
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()

app = FastAPI()
client = AsyncGroq()

@app.post("/chat/completions")
async def chat_completion_stream(request: Request):
    data = await request.json()
    content = data['messages'][2]['content']
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
                                            information: Andrew Garfield does, in fact, play two characters in "We Live in Time" (in theaters now), which is directed by John Crowley ("Brooklyn"). The Oscar nominee stars in the time-hopping romantic drama as Tobias, a cereal salesman who falls helplessly in love with a world-class chef named Almut (Florence Pugh). When we first meet Almut, she's told that her aggressive ovarian cancer has returned. Not wanting to spend her final months in and out of hospital rooms, she decides to forego treatment and instead train for an elite cooking competition.
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
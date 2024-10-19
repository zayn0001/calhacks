from datetime import datetime
import logging
from process_frame import process_frame  # Assuming you have this function in another file
from groqclient import generate_commentary_with_groq

# Set up logging for detailed error messages
logging.basicConfig(level=logging.INFO)

async def generate_commentary(image_data, width, height):
    try:
        logging.info(f"Generating commentary for frame: {width}x{height}")
        logging.info(f"Image data type: {type(image_data)}")
        logging.info(f"Image data length: {len(image_data) if image_data else 'N/A'}")

        if not image_data:
            raise ValueError("No image data provided")

        # Process the frame using process_frame function
        processed_frame = await process_frame(image_data, width, height)
        encoded_image = processed_frame['encoded_image']
        logging.info(f"Encoded image length: {len(encoded_image)}")

        try:
            # Call Groq API to generate commentary
            commentary_result = await generate_commentary_with_groq(encoded_image)
            commentary = commentary_result['commentary']
            embedding = commentary_result['embedding']

            logging.info(f"Generated commentary: {commentary}")
            logging.info(f"Generated embedding: {embedding}")

            return {
                'timestamp': datetime.now().isoformat(),
                'text': commentary,
                'embedding': embedding,
            }

        except Exception as groq_error:
            logging.error(f"Error in generate_commentary_with_groq: {groq_error}")
            return {
                'timestamp': datetime.now().isoformat(),
                'text': "Error generating commentary with Groq API.",
                'embedding': None,
            }

    except Exception as error:
        logging.error(f"Error in generate_commentary: {error}")
        return {
            'timestamp': datetime.now().isoformat(),
            'text': "Error processing frame or generating commentary.",
            'embedding': None,
        }

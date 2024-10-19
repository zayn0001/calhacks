from datetime import datetime
import logging
from process_frame import process_frame  # Assuming you have this function in another file
from groqclient import generate_commentary_with_groq

# Set up logging for detailed error messages
logging.basicConfig(level=logging.INFO)

async def generate_commentary(image_data, width, height):
        logging.info(f"Generating commentary for frame: {width}x{height}")
        logging.info(f"Image data type: {type(image_data)}")
        logging.info(f"Image data length: {len(image_data) if image_data else 'N/A'}")

        if not image_data:
            raise ValueError("No image data provided")

        # Process the frame using process_frame function
        processed_frame = await process_frame(image_data, width, height)
        print(processed_frame)
        encoded_image = processed_frame['encodedImage']
        logging.info(f"Encoded image length: {len(encoded_image)}")

        try:
            # Call Groq API to generate commentary
            description_result = generate_commentary_with_groq(encoded_image)
            description = description_result['description']
            embedding = description_result['embedding']

            logging.info(f"Generated commentary: {description}")
            logging.info(f"Generated embedding: {embedding}")

            return {
                'timestamp': datetime.now().isoformat(),
                'text': description,
                'embedding': embedding,
            }

        except Exception as groq_error:
            logging.error(f"Error in generate_commentary_with_groq: {groq_error}")
            return {
                'timestamp': datetime.now().isoformat(),
                'text': "Error generating commentary with Groq API.",
                'embedding': None,
            }
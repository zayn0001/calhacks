from PIL import Image
import io
import base64

def process_frame(image_data, width, height):
    try:
        print("Processing frame:", width, "x", height)

        # Check if image_data is base64 encoded
        if isinstance(image_data, str):
            # Remove the base64 prefix and decode to binary
            base64_data = image_data.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '')
            image_bytes = base64.b64decode(base64_data)
        elif isinstance(image_data, bytes):
            # If image_data is already bytes, use it directly
            image_bytes = image_data
        else:
            raise ValueError('Invalid image_data format')

        # Open the image from the bytes
        image = Image.open(io.BytesIO(image_bytes))

        # Resize the image (fit inside 640x360 while preserving aspect ratio)
        image.thumbnail((640, 360))

        # Compress the image and convert it to JPEG with quality 80
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=80)
        compressed_image = buffer.getvalue()

        # Encode the compressed image to base64
        encoded_image = f"data:image/jpeg;base64,{base64.b64encode(compressed_image).decode('utf-8')}"
        print("Image compressed, new size:", len(encoded_image))

        # Generate a simple frame description
        frame_description = f"Frame size {width}x{height}"
        print("Generated frame description:", frame_description)

        return {"frameDescription": frame_description, "encodedImage": encoded_image}

    except Exception as error:
        print("Error in process_frame:", error)
        raise

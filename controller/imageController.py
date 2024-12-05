# C:\Users\arla1\OneDrive\Desktop\Codes\Flask Website\controller\imageController.py

from PIL import Image
import io
from flask import send_file

def resize_image(filename):
    """
    Function to resize the image to 1920x865.
    This logic is separated from the main Flask app.
    """
    image_path = f"static/images/{filename}"
    try:
        with Image.open(image_path) as img:
            # Resize the image to 1920x865
            img = img.resize((2020, 1065))
            
            # Save the resized image to a byte stream
            img_io = io.BytesIO()
            img.save(img_io, 'PNG')
            img_io.seek(0)
            
            # Return the resized image as a response
            return send_file(img_io, mimetype='image/png')
    except Exception as e:
        # If error, you can return a simple message
        return f"Error resizing image: {e}"

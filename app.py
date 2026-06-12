# app.py
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from filters import *
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow requests from your Vercel frontend

@app.route('/')
def index():
    return jsonify({"status": "PixelForge API is running"})

# This route handles the image filtering
@app.route('/api/filter', methods=['POST'])
def apply_filter():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    filter_type = request.form.get('filter_type', 'grayscale')

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        img = Image.open(file.stream)
        
        # Apply filters based on your filters.py
        if filter_type == 'grayscale': result = grayscale(img)
        elif filter_type == 'invert': result = invert(img)
        elif filter_type == 'sepia': result = sepia(img)
        elif filter_type == 'red': result = channel_filter(img, 'red')
        elif filter_type == 'green': result = channel_filter(img, 'green')
        elif filter_type == 'blue': result = channel_filter(img, 'blue')
        elif filter_type == 'blur': result = blur(img)
        elif filter_type == 'sharpen': result = sharpen(img)
        elif filter_type == 'brightness': result = brightness(img)
        elif filter_type == 'flip_horizontal': result = flip_horizontal(img)
        elif filter_type == 'flip_vertical': result = flip_vertical(img)
        elif filter_type == 'pixelate': result = pixelate(img)
        elif filter_type == 'edge_detection': result = edge_detection(img)
        else: return jsonify({"error": "Invalid filter type"}), 400

        # Convert to RGB if needed (fixes transparency errors)
        if result.mode in ("RGBA", "P"):
            result = result.convert("RGB")

        # Save to memory and send back
        img_byte_arr = io.BytesIO()
        result.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return send_file(img_byte_arr, mimetype='image/png')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
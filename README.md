🖼️ PixelForge  Image Filter Web App

A Python image filtering tool with 13 filters (grayscale, sepia, blur, edge detection and more), originally built as a terminal project with Pillow & NumPy — and now reborn as a full-stack web app.

🌐 Live Demo: https://pixelforgewebapp.vercel.app

🚀 From Script to Web App

This started as a simple Python console tool: pick a filter from a menu, process an image, save it locally. For this version, I rebuilt it as an interactive web application to learn how to turn a standalone script into something usable through a browser.

What changed:


Wrapped the original filter functions (filters.py) in a Flask REST API (app.py) exposing a /api/filter endpoint
Built a frontend (HTML, CSS, JavaScript) where users upload an image, pick a filter, and see the result instantly
Connected frontend and backend using the Fetch API with FormData to send images and receive processed results as blobs
Handled CORS so the frontend (hosted separately) can talk to the backend API
Deployed the backend on Render (Flask + Gunicorn) and the frontend on Vercel as a static site — two independent services talking over HTTPS


This was my first time connecting a Python backend to a separate frontend via an API and deploying both to production hosting platforms.


✨ Features


13 image filters, applied directly in the browser
Drag & drop or click-to-upload image input
Live preview of original and filtered images
One-click download of the filtered result
Fully responsive interface
REST API backend, deployable independently of the frontend



🎨 Available Filters

#      Filter               Description
1      Grayscale            Removes all color
2      Invert               Inverts all pixel colors
3      Sepia                Warm vintage brown tone
4      Red filter           Keeps only the red channel
5      Green filter         Keeps only the green channel
6      Blue filter          Keeps only the blue channel
7      Blur                 Softens the image
8      Sharpen              Makes edges more defined
9      Brightness           Makes the image brighter
10     Flip Horizontal      Mirrors the image left-right
11     Flip Vertical        Flips the image upside down
12     Pixelate             Creates a pixel art effect
13     Edge Detection       Highlights the edges in the image


Architecture

Frontend: static HTML/CSS/JS, hosted on Vercel
Backend: Flask API with Flask-CORS and Gunicorn, hosted on Render



🛠️ Tech Stack


Python — Flask, Flask-CORS, Pillow, NumPy, Gunicorn
Frontend — HTML, CSS, JavaScript (Fetch API, FormData, Blob)
Hosting — Render (backend API), Vercel (frontend)



🚀 Running It Locally

Option 1: Use the live API (quickest)


Open script.js
Make sure API_URL points to the live backend:


js   const API_URL = 'https://pixelforge-3-h4s2.onrender.com/api/filter';


Open index.html directly in your browser — no server needed, it'll call the hosted API.


Option 2: Run your own backend


Install dependencies and run the Flask app:


bash   pip install -r requirements.txt
   python app.py


Or deploy app.py + filters.py to Render (or any Python host) and get your own service URL.
In script.js, replace API_URL with your backend's URL (e.g. http://localhost:5000/api/filter or your own Render URL ending in /api/filter).
Open index.html in your browser — no build step needed.



📁 Project Structure

PixelForge/
├── app.py              # Flask API (backend)
├── filters.py          # All filter functions (Pillow + NumPy)
├── index.html           # Frontend page
├── style.css            # Frontend styling
├── script.js            # Frontend logic (API calls)
├── requirements.txt     # Python dependencies
├── Procfile              # Render deployment config
└── README.md


💡 Why This Project?

This project is great for anyone who wants to learn:


How to expose Python functions through a REST API with Flask
How to connect a JavaScript frontend to a Python backend
How CORS works between two different hosted domains
How to deploy a full-stack app using free services (Render + Vercel)
Basic image processing concepts with Pillow and NumPy


Feel free to clone it, run it, and modify it to learn! 🚀


🏷️ Topics

python flask rest-api image-processing pillow numpy javascript vercel render full-stack web-app beginner-project


👨‍💻 Author

Iyed Ferjeoui — CS Student at ISSAT Sousse, Tunisia
🔗 GitHub

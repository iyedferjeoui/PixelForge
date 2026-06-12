// Point this to your deployed backend (e.g. Render/Railway URL)
// Example: 'https://pixelforge-backend.onrender.com/api/filter'
const API_URL = 'https://YOUR-BACKEND-URL.onrender.com/api/filter';

const imageInput = document.getElementById('imageInput');
const fileName = document.getElementById('fileName');
const dropZone = document.getElementById('dropZone');
const filterSelect = document.getElementById('filterSelect');
const applyBtn = document.getElementById('applyBtn');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile = null;

// 1. Handle File Selection
imageInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

// 2. Handle Drag and Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
        imageInput.files = e.dataTransfer.files;
    }
});

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    applyBtn.disabled = false;

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        resultImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='16'%3EResult will appear here%3C/text%3E%3C/svg%3E";
        downloadBtn.hidden = true;
    };
    reader.readAsDataURL(file);
}

// 3. Handle API Request
applyBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    loader.hidden = false;
    applyBtn.disabled = true;
    applyBtn.textContent = 'Processing...';

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('filter_type', filterSelect.value);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        // The API returns the image file directly as a Blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        resultImage.src = imageUrl;
        downloadBtn.href = imageUrl;
        downloadBtn.hidden = false;

    } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image: ' + error.message);
    } finally {
        loader.hidden = true;
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Filter';
    }
});
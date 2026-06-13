// Point this to your deployed backend
const API_URL = 'https://pixelforge-3-h4s2.onrender.com/api/filter';

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
    const validExtensions = /\.(jpe?g|png|gif|bmp|webp|tiff?)$/i;
    const isImageType = file && file.type.startsWith('image/');
    const isImageExt = file && validExtensions.test(file.name);

    if (!file || (!isImageType && !isImageExt)) {
        alert('Please select a valid image file (JPG, PNG, GIF, BMP, WEBP, TIFF).');
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

    // Show a "waking up server" message if it takes too long (Render free tier cold start)
    const wakeupTimer = setTimeout(() => {
        const loaderText = loader.querySelector('p');
        if (loaderText) loaderText.textContent = 'Waking up the server, this can take up to a minute...';
    }, 5000);

    const fetchWithRetry = async (retries = 1) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;
        } catch (err) {
            if (retries > 0) {
                return fetchWithRetry(retries - 1);
            }
            throw err;
        }
    };

    try {
        const response = await fetchWithRetry();

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
        if (error.name === 'AbortError') {
            alert('The server took too long to respond. Please try again in a moment.');
        } else {
            alert('Failed to process image: ' + error.message);
        }
    } finally {
        clearTimeout(wakeupTimer);
        loader.hidden = true;
        const loaderText = loader.querySelector('p');
        if (loaderText) loaderText.textContent = 'Processing image...';
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Filter';
    }
});

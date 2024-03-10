const convertButton = document.querySelector('#convertButton');
const processButton = document.querySelector('#processButton');
const fileInput = document.querySelector('#fileInput');
const keyInput = document.querySelector('#key');
const encryptRadio = document.querySelector('#encryptRadio');
const decryptRadio = document.querySelector('#decryptRadio');
const feedbackDiv = document.querySelector('#feedback');

// Send file conversion request to main process
convertButton.addEventListener('click', () => {
    // Show conversion feedback
    feedbackDiv.textContent = 'Converting file...';
    
    const filePath = fileInput.files[0].path;
    const outputFormat = document.querySelector('#outputFormat').value;
    const videoResolution = document.querySelector('#videoResolution').value;
    const bitrate = document.querySelector('#bitrate').value;
    
    ipcRenderer.send('convert', { filePath, outputFormat, videoResolution, bitrate });
});

// Send file encryption/decryption request to main process
processButton.addEventListener('click', () => {
    // Show encryption/decryption feedback
    feedbackDiv.textContent = 'Processing file...';

    const filePath = fileInput.files[0].path;
    const key = keyInput.value;
    const operation = document.querySelector('input[name="operation"]:checked').value;
    
    ipcRenderer.send('process', { filePath, key, operation });
});

// Event listener for conversion and encryption/decryption success events
ipcRenderer.on('conversion-successful', (event, outputFile) => {
    updateFeedback(`Converted: ${outputFile}`);
});

ipcRenderer.on('encrypting-successful', (event, outputFile) => {
    updateFeedback(`Encrypted: ${outputFile}_encrypted.mp4`);
});

ipcRenderer.on('decrypt-successful', (event, outputFile) => {
    updateFeedback(`Decrypted: ${outputFile}_decrypted.mp4`);
});

// Event listener for errors during conversion or encryption/decryption
ipcRenderer.on('error', (event, errorMessage) => {
    updateFeedback(`Error: ${errorMessage}`);
});

// Function to update feedback messages
function updateFeedback(message) {
    feedbackDiv.textContent = message;
}
//const { ipcRenderer } = window.Electron
const convertButton = document.querySelector('#convertButton');
const processButton = document.querySelector('#processButton');
const convertAudioButton = document.querySelector('#convertAudioButton');
const fileInput = document.querySelector('#fileInput');
const keyInput = document.querySelector('#key');
const encryptRadio = document.querySelector('#encryptRadio');
const decryptRadio = document.querySelector('#decryptRadio');
const feedbackDiv = document.querySelector('#feedback');
const downloadButton = document.querySelector('#downloadButton');
const videoUrlInput = document.querySelector('#videoUrl');
const outputFolderInput = document.querySelector('#outputFolder');
const videoTypeRadio = document.querySelector('#videoType');
//const audioTypeRadio = document.querySelector('#audioType');
// Send file conversion request to main process
convertButton?.addEventListener('click', () => {
    // Show conversion feedback
    feedbackDiv.textContent = 'Converting file...';
    
    const filePath = fileInput.files[0].path;
    const outputFormat = document.querySelector('#outputFormat').value;
    const videoResolution = document.querySelector('#videoResolution').value;
    const bitrate = document.querySelector('#bitrate').value;
    
    ipcRenderer.send('convert', { filePath, outputFormat, videoResolution, bitrate });
});
convertAudioButton?.addEventListener('click', () => {
    // Show conversion feedback
    feedbackDiv.textContent = 'Converting file...';
    
    const filePath = fileInput.files[0].path;
    const outputFormat = document.querySelector('#outputFormat').value;
    const bitrate = document.querySelector('#bitrate').value;
    
    ipcRenderer.send('convertAudio', { filePath, outputFormat, bitrate });
});
// Send file encryption/decryption request to main process
processButton?.addEventListener('click', () => {
    // Show encryption/decryption feedback
    feedbackDiv.textContent = 'Processing file...';

    const filePath = fileInput.files[0].path;
    const key = keyInput.value;
    const operation = document.querySelector('input[name="operation"]:checked').value;
    
    ipcRenderer.send('process', { filePath, key, operation });
});

downloadButton?.addEventListener('click', () => {
    // Show download feedback
    feedbackDiv.textContent = 'Downloading...';

    const videoUrl = videoUrlInput.value;
    const outputFolder = outputFolderInput.files[0].path;
    const outputType = document.querySelector('input[name="outputType"]:checked').value;

    ipcRenderer.send('download', { videoUrl, outputFolder, outputType });
});

const updateYTdlpButton = document.getElementById('updateYTdlpButton');
updateYTdlpButton.addEventListener('click', () => {
    // Send a message to the main process to trigger the YT-dlp update
    ipcRenderer.send('update-ytdlp');
    feedbackDiv.textContent = 'updating...'
});

// Event listener for conversion and encryption/decryption success events
ipcRenderer.receive('conversion-successful', (event, outputFile) => {
    updateFeedback(`Converted: ${outputFile}`);
    //console.log("ipcrender ran")
});

ipcRenderer.receive('encrypt-successful', (event, outputFile) => {
    updateFeedback(`Encrypted: ${outputFile}_encrypted.mp4`);
   // console.log("ipcrender ran")
});

ipcRenderer.receive('decrypt-successful', (event, outputFile) => {
    updateFeedback(`Decrypted: ${outputFile}_decrypted.mp4`);
   // console.log("ipcrender ran")
});

// Event listener for errors during conversion or encryption/decryption
ipcRenderer.receive('error', (event, errorMessage) => {
    updateFeedback(`Error: ${errorMessage}`);
   // console.log("ipcrender ran")
});
ipcRenderer.receive('download-successful',(event, message) =>{
updateFeedback(`downloaded: ${message}`)
});
ipcRenderer.receive('update-successful', (event, outputFile) => {
    updateFeedback(`updated YT-dl`);
    //console.log("ipcrender ran")
});
// Function to update feedback messages
function updateFeedback(message) {
    feedbackDiv.textContent = message;
    //console.log("update function for feedbackdiv ran")
}
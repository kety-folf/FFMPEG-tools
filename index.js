const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // Import exec function
const ffmpeg = require('ffmpeg-static');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Disable nodeIntegration
            contextIsolation: true, // Enable context isolation
            preload: path.join(__dirname, 'preload.js') // Use preload script
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('convert', (event, { filePath, outputFormat, videoResolution, bitrate }) => {
    // Check if any parameter is undefined
    if (!filePath || !outputFormat || !videoResolution || !bitrate) {
        console.error('Error: One or more parameters are undefined.');
        return;
    }

    const outputFile = `${filePath}_converted.${outputFormat}`;

    const ffmpegCommand = `ffmpeg -i "${filePath}" -s "${videoResolution}" -b:v "${bitrate}" "${outputFile}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting file: ${error.message}`);
            return;
        }
        console.log(`File converted successfully: ${outputFile}`);
        event.sender.send('conversion-successful', outputFile);
    });
}); 
ipcMain.on('convertAudio', (event, { filePath, outputFormat, bitrate }) => {
    // Check if any parameter is undefined
    if (!filePath || !outputFormat || !bitrate) {
        console.error('Error: One or more parameters are undefined.');
        return;
    }

    const outputFile = `${filePath}_converted.${outputFormat}`;

    const ffmpegCommand = `ffmpeg -i "${filePath}" -b:a "${bitrate}" "${outputFile}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting file: ${error.message}`);
            return;
        }
        console.log(`File converted successfully: ${outputFile}`);
        event.sender.send('conversion-successful', outputFile);
    });
});

ipcMain.on('process', (event, { filePath, key, operation }) => {
    console.log(`Processing file: ${filePath}, Key: ${key}, Operation: ${operation}`);

    // Check if any parameter is undefined
    if (!filePath || !key || !operation) {
        console.error('Error: One or more parameters are undefined.');
        return;
    }

    let ffmpegCommand;
    let outputFilePath;

    // Determine the ffmpeg command based on the operation
    if (operation === 'encrypt') {
        outputFilePath = `${filePath}_encrypted.mp4`;
        ffmpegCommand = `ffmpeg -i "${filePath}" -vcodec copy -acodec copy -encryption_scheme cenc-aes-ctr -encryption_key ${key} -encryption_kid a7e61c373e219033c21091fa607bf3b8 "${outputFilePath}"`;
    } else if (operation === 'decrypt') {
        outputFilePath = `${filePath}_decrypted.mp4`;
        ffmpegCommand = `ffmpeg -decryption_key ${key} -i "${filePath}" -vcodec libx264 "${outputFilePath}"`;
    } else {
        console.error('Error: Invalid operation.');
        return;
    }

    console.log(`Executing ffmpeg command: ${ffmpegCommand}`);

    // Execute the ffmpeg command
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ${operation === 'encrypt' ? 'encrypting' : 'decrypting'} file: ${error.message}`);
            return;
        }

        console.log(`File ${operation === 'encrypt' ? 'encrypted' : 'decrypted'} successfully: ${outputFilePath}`);
        
        // Send message back to renderer process indicating success
        event.sender.send(`${operation}-successful`, outputFilePath);
    });
});


    

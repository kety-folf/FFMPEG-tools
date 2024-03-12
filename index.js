const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // Import exec function
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');

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

    const ffmpegCommand = `.\\node_modules\\ffmpeg-static\\ffmpeg.exe -i "${filePath}" -s "${videoResolution}" -b:v "${bitrate}" "${outputFile}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting file: ${error.message}`);
            event.sender.send('error',`${error.message}`)
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
        event.sender.send('error',`Error: One or more parameters are undefined.`)
        return;
    }

    const outputFile = `${filePath}_converted.${outputFormat}`;

    const ffmpegCommand = `.\\node_modules\\ffmpeg-static\\ffmpeg.exe -i "${filePath}" -b:a "${bitrate}" "${outputFile}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting file: ${error.message}`);
            event.sender.send('error',`${error.message}`);
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
        ffmpegCommand = `.\\node_modules\\ffmpeg-static\\ffmpeg.exe -i "${filePath}" -vcodec copy -acodec copy -encryption_scheme cenc-aes-ctr -encryption_key ${key} -encryption_kid a7e61c373e219033c21091fa607bf3b8 "${outputFilePath}"`;
    } else if (operation === 'decrypt') {
        outputFilePath = `${filePath}_decrypted.mp4`;
        ffmpegCommand = `.\\node_modules\\ffmpeg-static\\ffmpeg.exe -decryption_key ${key} -i "${filePath}" -vcodec libx264 "${outputFilePath}"`;
    } else {
        console.error('Error: Invalid operation.');
        return;
    }

    console.log(`Executing ffmpeg command: ${ffmpegCommand}`);

    // Execute the ffmpeg command
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ${operation === 'encrypt' ? 'encrypting' : 'decrypting'} file: ${error.message}`);
            event.sender.send('error',`an error occoured: ${error.message}`)
            return;
        }

        console.log(`File ${operation === 'encrypt' ? 'encrypted' : 'decrypted'} successfully: ${outputFilePath}`);
        
        // Send message back to renderer process indicating success
        event.sender.send(`${operation}-successful`, outputFilePath);
    });
});
ipcMain.on('download', (event, { videoUrl, outputFolder, outputType }) => {
    // Check if any parameter is undefined
    if (!videoUrl || !outputFolder || !outputType) {
        console.error('Error: One or more parameters are undefined.');
        event.sender.send('error', 'One or more parameters are undefined.');
        return;
    }

    const ytDlpExecutable = path.join(__dirname, 'yt-dlp.exe');

    // Verify yt-dlp executable exists
    if (!fs.existsSync(ytDlpExecutable)) {
        console.error(`Error: yt-dlp executable not found at ${ytDlpExecutable}`);
        event.sender.send('error', 'yt-dlp executable not found.');
        return;
    }

    let outputFormat;
    if (outputType === 'video') {
        outputFormat = 'bv*+140';
    } else if (outputType === 'audio') {
        outputFormat = '140';
    } else {
        console.error('Error: Invalid outputType.');
        event.sender.send('error', 'Invalid outputType.');
        return;
    }

    // Escape special characters in paths
    const escapedVideoUrl = `"${videoUrl}"`;
    const escapedOutputFolder = path.dirname(outputFolder)

    // Construct command
    const command = `"${ytDlpExecutable}" -f ${outputFormat} ${escapedVideoUrl}`;

    exec(command, { cwd: escapedOutputFolder }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading ${outputType}: ${error}`);
            console.log(escapedOutputFolder)
            event.sender.send('error', `Error downloading ${outputType}: ${error.message}`);
            return;
        }

        console.log(`Download of ${outputType} completed.`);
        event.sender.send('download-successful',videoUrl);
    });
});
    
ipcMain.on('update-ytdlp', (event) => {
    const ytDlpExecutable = path.join(__dirname, 'yt-dlp.exe');

    // Verify yt-dlp executable exists
    if (!fs.existsSync(ytDlpExecutable)) {
        console.error(`Error: yt-dlp executable not found at ${ytDlpExecutable}`);
        return;
    }

    // Construct command to update YT-dlp
    const command = `"${ytDlpExecutable}" -U`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error updating YT-dlp: ${error}`);
            event.sender.send('error',error)
            return;
        }

        console.log('YT-dlp updated successfully.');
        event.sender.send('update-successful',error)
    });
});
# FFMPEG Electron App

This is a simple Electron application for file conversion, encryption, and decryption using FFMPEG.

## Features

- Convert video and audio files to different formats.
- Encrypt MP4 files using FFMPEG's encryption capabilities.
- Decrypt encrypted video files.
- yt-dlp
## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/kety-folf/FFMPEG-tools
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the Electron application:

    ```bash
    npm start
    ```

2. Select the desired operation (conversion, encryption, or decryption) and provide necessary input such as file path, output format, encryption key, etc.

## File Structure

- `src/renderer.js`: Renderer process JavaScript file for handling user interactions.
- `src/preload.js`: Preload script for exposing Electron APIs to the renderer process securely.
- `index.js`: Main process JavaScript file for handling Electron main process logic.

## Dependencies

- Electron: Framework for building cross-platform desktop applications using web technologies.
- FFMPEG: Multimedia framework for handling audio, video, and other multimedia files.
- ffmpeg-static: Static FFMPEG binaries for Electron applications.

## License

This project is licensed under the [MIT License](LICENSE).

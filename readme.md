# FFMPEG Electron App

This is a simple Electron application for file conversion, encryption, and decryption using FFMPEG.

## Features

- Convert video files to different formats.
- Encrypt video files using FFMPEG's encryption capabilities.
- Decrypt encrypted video files.

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

- `src/index.html`: Main HTML file for the Electron application.
- `src/renderer.js`: Renderer process JavaScript file for handling user interactions.
- `src/styles.css`: CSS file for styling the user interface.
- `src/preload.js`: Preload script for exposing Electron APIs to the renderer process securely.
- `src/index.js`: Main process JavaScript file for handling Electron main process logic.

## Dependencies

- Electron: Framework for building cross-platform desktop applications using web technologies.
- FFMPEG: Multimedia framework for handling audio, video, and other multimedia files.
- ffmpeg-static: Static FFMPEG binaries for Electron applications.

## License

This project is licensed under the [MIT License](LICENSE).

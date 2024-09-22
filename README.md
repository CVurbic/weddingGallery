# My Small Wedding

A React-based web application for managing and displaying wedding photos.

## Project Overview

This project is a wedding photo gallery that allows users to upload, view, and manage wedding photos. It uses Firebase for backend services, including storage and analytics.

## Features

- Photo upload with thumbnail generation
- Gallery view with masonry layout
- Fullscreen photo view with navigation
- Responsive design for various screen sizes
- Sorting photos by upload date

## Technologies Used

- React
- Firebase (Storage, Analytics)
- Create React App
- browser-image-compression (for thumbnail generation)
- react-icons (for UI icons)

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (usually comes with Node.js)
- A Firebase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mySmallWedding.git
   cd mySmallWedding
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   REACT_APP_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_PUBLIC_FIREBASE_APP_ID=your_app_id
   REACT_APP_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

- `src/components`: React components (PhotoGallery, PhotoUploader)
- `src/services`: Firebase service configuration and utility functions
- `src/styles`: CSS files for styling components
- `src/constants.js`: Application-wide constants and configuration

## Customization

You can customize the application by modifying the following files:

- `src/constants.js`: Update couple names, wedding date, and other app-wide settings
- `src/styles`: Modify CSS files to change the look and feel of the application



## Acknowledgments

- Create React App for the initial project setup
- Firebase for backend services
- browser-image-compression for client-side image compression
- react-icons for providing a wide range of icons

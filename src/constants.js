// Couple Information
export const COUPLE_NAMES = 'Ulla & Christian';
export const WEDDING_DATE = '27. Siječnja 2024';

// App Configuration
export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB in bytes
export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
];

// Firebase Configuration
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA7X71NQCq10oCZleUTx3kEcjmRbfxebbs",
    authDomain: "my-wedding-fa377.firebaseapp.com",
    projectId: "my-wedding-fa377",
    storageBucket: "gs://my-wedding-fa377.appspot.com/",
    messagingSenderId: "238164006559",
    appId: "1:238164006559:web:af714b5241b18c502c34aa",
    measurementId: "G-H4PTB8WTS5"
};

// UI Text
export const UPLOAD_BUTTON_TEXT = 'Upload Photos';
export const GALLERY_TITLE = 'Wedding Photos';
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${COUPLE_NAMES}. All rights reserved.`;

// Styling
export const PRIMARY_COLOR = '#FF69B4';
export const SECONDARY_COLOR = '#4169E1';
export const FONT_FAMILY = "'Roboto', sans-serif";

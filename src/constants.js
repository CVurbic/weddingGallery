

// Couple Information
export const COUPLE_NAMES = 'HisName & HerName';
export const WEDDING_DATE = 'DD.MM.YYYY';

// App Configuration
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB in bytes
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
    apiKey: process.env.REACT_APP_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// UI Text
export const UPLOAD_BUTTON_TEXT = 'Upload Photos';
export const GALLERY_TITLE = 'Wedding Photos';
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${COUPLE_NAMES}. All rights reserved.`;

// Styling
export const PRIMARY_COLOR = '#FF69B4';
export const SECONDARY_COLOR = '#4169E1';
export const FONT_FAMILY = "'Roboto', sans-serif";

// Local Images Folder
export const LOCAL_IMAGES_FOLDER = '/images';

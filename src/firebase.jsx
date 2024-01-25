

// src/firebase.js

import { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref, listAll } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA7X71NQCq10oCZleUTx3kEcjmRbfxebbs",
    authDomain: "my-wedding-fa377.firebaseapp.com",
    projectId: "my-wedding-fa377",
    storageBucket: "gs://my-wedding-fa377.appspot.com/",
    messagingSenderId: "238164006559",
    appId: "1:238164006559:web:af714b5241b18c502c34aa",
    measurementId: "G-H4PTB8WTS5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    const contextValue = { app, analytics, storage };

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

export const getAllPhotos = async () => {
    const storageRef = ref(storage, '/'); // Reference to the root of your storage bucket
    const fileList = await listAll(storageRef);
    return fileList.items.map(item => item.fullPath);
};
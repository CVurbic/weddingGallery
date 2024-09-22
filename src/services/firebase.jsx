import { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref, listAll, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { FIREBASE_CONFIG } from '../constants';

const app = initializeApp(FIREBASE_CONFIG);
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

export const uploadPhoto = async (file) => {
    const storageRef = ref(storage, file.name);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Upload response:', snapshot);
        console.log('File available at', snapshot.ref.fullPath);
        return snapshot;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export const fetchPhotos = async (storage) => {
    try {
        const listRef = ref(storage, '/');
        const res = await listAll(listRef);
        const photoList = res.items.map(item => item.fullPath);

        const filteredPhotos = [];
        const photoListFull = photoList.filter((path) => !path.endsWith('200x200.webp'));
        const photoList200 = photoList.filter((path) => path.endsWith('200x200.webp'));

        await Promise.all(photoList200.map(async (path, index) => {
            const fileRef = ref(storage, path);
            try {
                const metadataSnapshot = await getMetadata(fileRef);
                const creationTime = new Date(metadataSnapshot.timeCreated);
                const downloadUrl = await getDownloadURL(fileRef);

                let imageName = path.replace("_200x200.webp", "");
                let realImage = photoListFull.find(i => i.includes(imageName));
                let realImageRef = ref(storage, realImage);
                filteredPhotos.push({ url: downloadUrl, path, creationTime, fullImageUrl: null, realImageRef: realImageRef });
            } catch (error) {
                console.error('Error fetching metadata or download URL:', error.message);
            }
        }));

        filteredPhotos.sort((a, b) => b.creationTime - a.creationTime);

        return filteredPhotos;
    } catch (error) {
        console.error('Error fetching photos:', error.message);
        throw error;
    }
};

export const uploadMedia = async (file) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // You might want to save metadata about the uploaded file
    // (e.g., whether it's a photo or video) in your database here

    return downloadURL;
};
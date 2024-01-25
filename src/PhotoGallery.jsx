import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import './PhotoGallery.css'; // Import your CSS file for PhotoGallery

const PhotoGallery = (uploadTrigger) => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage]);
    useEffect(() => {
        if (uploadTrigger) fetchPhotos();
        // eslint-disable-next-line
    }, [uploadTrigger]);

    const fetchPhotos = async () => {
        try {
            const photoList = await getAllPhotos();
            const photoURLs = await Promise.all(photoList.map(async (path) => {
                const fileRef = ref(storage, path);
                const url = await getDownloadURL(fileRef);

                // Retrieve metadata for the file
                const metadataSnapshot = await getMetadata(fileRef);
                const creationTime = new Date(metadataSnapshot.timeCreated); // Convert to Date object

                return { url, path, creationTime };
            }));

            // Sort the photos by creation time in descending order
            photoURLs.sort((a, b) => b.creationTime - a.creationTime); // Compare Date objects

            setPhotos(photoURLs);
        } catch (error) {
            console.error('Error fetching photos:', error.message);
        }
    };



    const handlePhotoClick = (index) => {
        setFullscreenPhoto(photos[index]);
    };

    const handleCloseFullscreen = () => {
        setFullscreenPhoto(null);
    };

    return (
        <div className="photo-gallery-container">
            <h2>Photo Gallery</h2>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo.url}
                        alt={`${index}`}
                        className="gallery-photo"
                        onClick={() => handlePhotoClick(index)}
                    />
                ))}
            </div>
            {fullscreenPhoto && (
                <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
                    <img src={fullscreenPhoto.url} alt="Fullscreen" className="fullscreen-photo" />
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;

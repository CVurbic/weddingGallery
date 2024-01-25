// src/PhotoGallery.jsx

import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import './PhotoGallery.css'; // Import your CSS file for PhotoGallery

const PhotoGallery = () => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage]);

    const fetchPhotos = async () => {
        try {
            const photoList = await getAllPhotos();
            const photoURLs = await Promise.all(photoList.map(async (path) => {
                const url = await getDownloadURL(ref(storage, path));
                return { url, path };
            }));
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

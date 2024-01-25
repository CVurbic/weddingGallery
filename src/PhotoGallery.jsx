// src/PhotoGallery.jsx

import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref } from 'firebase/storage';

const PhotoGallery = () => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);

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

    const enlargeImage = (index) => {
        // Set a CSS class to enlarge the clicked image
        const image = document.getElementById(`image-${index}`);
        image.classList.toggle('enlarged');
    };

    return (
        <div className="photo-gallery-container">
            <h2>Photo Gallery</h2>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        id={`image-${index}`}
                        src={photo.url}
                        alt={`${index}`}
                        onClick={() => enlargeImage(index)}
                        loading="lazy" // Lazy loading attribute
                    />
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;

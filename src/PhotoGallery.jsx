import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './PhotoGallery.css'; // Import your CSS file for PhotoGallery
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PhotoGallery = ({ uploadTrigger }) => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage, uploadTrigger]); // Fetch photos whenever storage or uploadTrigger changes

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
        setCurrentPhotoIndex(index);
    };

    const handleCloseFullscreen = () => {
        setFullscreenPhoto(null);
    };

    const handleNextPhoto = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const nextIndex = (currentPhotoIndex + 1) % photos.length;
        setCurrentPhotoIndex(nextIndex);
        setFullscreenPhoto(photos[nextIndex]);
    };

    const handlePreviousPhoto = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const previousIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        setCurrentPhotoIndex(previousIndex);
        setFullscreenPhoto(photos[previousIndex]);
    };


    return (
        <div className="photo-gallery-container">
            <h2>Photo Gallery</h2>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <LazyLoadImage

                        key={index}
                        src={photo.url}
                        alt={`${index}`}
                        className="gallery-photo"
                        onClick={() => handlePhotoClick(index)} />

                ))}
            </div>
            {fullscreenPhoto && (
                <div
                    className="fullscreen-overlay"
                    onClick={handleCloseFullscreen}
                >
                    <div className="fullscreen-image-container">
                        <IoIosArrowBack className="arrow-icon left-arrow" onClick={handlePreviousPhoto} />
                        <img src={fullscreenPhoto.url} alt="Fullscreen" className="fullscreen-photo" />
                        <IoIosArrowForward className="arrow-icon right-arrow" onClick={handleNextPhoto} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default PhotoGallery;

import React, { useEffect, useState, useCallback } from 'react';
import { useFirebase, fetchPhotos } from '../services/firebase';
import { GALLERY_TITLE } from '../constants';
import { getDownloadURL } from 'firebase/storage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ImSpinner2 } from "react-icons/im";
import '../styles/PhotoGallery.css';

const PhotoGallery = ({ uploadTrigger }) => {
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { storage } = useFirebase();

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const fetchedPhotos = await fetchPhotos(storage);
                setPhotos(fetchedPhotos);
            } catch (error) {
                console.error('Error loading photos:', error.message);
            }
        };
        loadPhotos();
    }, [uploadTrigger, storage]);

    const getSpanClass = (index) => {
        if (index % 11 === 0) return 'span-3-tall';
        if (index % 7 === 0) return 'span-2-tall';
        if (index % 5 === 0) return 'span-2';
        if (index % 3 === 0) return 'span-tall';
        return '';
    };

    const handlePhotoClick = useCallback(async (index) => {
        setIsLoading(true);
        try {
            const fullImageUrl = await getDownloadURL(photos[index].realImageRef);
            setFullscreenPhoto({ ...photos[index], fullImageUrl });
            setCurrentPhotoIndex(index);
        } catch (error) {
            console.error('Error fetching full image:', error);
        }
        setIsLoading(false);
    }, [photos]);

    const handleCloseFullscreen = () => {
        setFullscreenPhoto(null);
    };

    const handleNextPhoto = useCallback(() => {
        const nextIndex = (currentPhotoIndex + 1) % photos.length;
        handlePhotoClick(nextIndex);
    }, [currentPhotoIndex, photos.length, handlePhotoClick]);

    const handlePreviousPhoto = useCallback(() => {
        const previousIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        handlePhotoClick(previousIndex);
    }, [currentPhotoIndex, photos.length, handlePhotoClick]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'ArrowRight') {
            handleNextPhoto();
        } else if (event.key === 'ArrowLeft') {
            handlePreviousPhoto();
        } else if (event.key === 'Escape') {
            handleCloseFullscreen();
        }
    }, [handleNextPhoto, handlePreviousPhoto]);

    useEffect(() => {
        if (fullscreenPhoto) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fullscreenPhoto, handleKeyDown]);

    return (
        <div className="photo-gallery-container">
            <h2 className="gallery-title">{GALLERY_TITLE}</h2>
            <div className="photo-gallery">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className={`photo-item ${getSpanClass(index)}`}
                        onClick={() => handlePhotoClick(index)}
                    >
                        <img src={photo.url} alt={`${index + 1}`} />
                    </div>
                ))}
            </div>
            {fullscreenPhoto && (
                <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
                    <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
                        {isLoading ? (
                            <div className="loading-icon"><ImSpinner2 className="spinner" /></div>
                        ) : (
                            <img
                                src={fullscreenPhoto.fullImageUrl}
                                alt="Fullscreen"
                                className="fullscreen-photo"
                            />
                        )}
                    </div>
                    <IoIosArrowBack className="arrow-icon left-arrow" onClick={handlePreviousPhoto} />
                    <IoIosArrowForward className="arrow-icon right-arrow" onClick={handleNextPhoto} />
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;

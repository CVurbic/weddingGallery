import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './PhotoGallery.css'; // Import your CSS file for PhotoGallery
import { LazyLoadImage } from 'react-lazy-load-image-component';
import JSZip from 'jszip';

const PhotoGallery = ({ uploadTrigger }) => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage, uploadTrigger]); // Fetch photos whenever storage or uploadTrigger changes

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (!isUnlocked) return; // Don't handle keypress if the download button is locked
            if (event.keyCode === 37) {
                // Left arrow key
                handlePreviousPhoto();
            } else if (event.keyCode === 39) {
                // Right arrow key
                handleNextPhoto();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line
    }, [fullscreenPhoto, isUnlocked]); // Listen for key events when fullscreenPhoto changes

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

    const handleNextPhoto = () => {
        const nextIndex = (currentPhotoIndex + 1) % photos.length;
        setCurrentPhotoIndex(nextIndex);
        setFullscreenPhoto(photos[nextIndex]);
    };

    const handlePreviousPhoto = () => {
        const previousIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        setCurrentPhotoIndex(previousIndex);
        setFullscreenPhoto(photos[previousIndex]);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleUnlockDownload = () => {
        // Implement your password validation logic here
        // For demonstration purposes, let's assume the correct password is "password123"
        const correctPassword = "password123";
        if (password === correctPassword) {
            setIsUnlocked(true);
        } else {
            alert("Incorrect password. Please try again.");
        }
    };

    const handleDownloadPhotos = async () => {
        try {
            const zip = new JSZip();

            // Add each photo to the zip file
            photos.forEach((photo, index) => {
                const filename = `photo_${index}.jpg`; // Adjust filename format as needed
                // Fetch the photo as a blob
                fetch(photo.url)
                    .then(response => response.blob())
                    .then(blob => {
                        // Add the blob to the zip file with the filename
                        zip.file(filename, blob, { binary: true });
                    })
                    .catch(error => {
                        console.error('Error fetching photo:', error);
                    });
            });

            // Generate the zip file asynchronously
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Create a URL for the zip file blob
            const zipUrl = URL.createObjectURL(zipBlob);

            // Trigger the download of the zip file
            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = 'photos.zip'; // Set the default download filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            URL.revokeObjectURL(zipUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error creating zip file:', error);
        }
    };


    return (
        <div className="photo-gallery-container">
            <h1>Photo Gallery</h1>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <LazyLoadImage
                        key={index}
                        src={photo.url}
                        alt={`${index}`}
                        className="gallery-photo"
                        onClick={() => handlePhotoClick(index)}
                    />
                ))}
            </div>
            {fullscreenPhoto && (
                <div>
                    <div className="fullscreen-overlay" onClick={handleCloseFullscreen}></div>

                    <div className="fullscreen-image-container">
                        <img src={fullscreenPhoto.url} alt="Fullscreen" className="fullscreen-photo" />
                    </div>
                    <IoIosArrowBack className="arrow-icon left-arrow" onClick={handlePreviousPhoto} />
                    <IoIosArrowForward className="arrow-icon right-arrow" onClick={handleNextPhoto} />
                </div>
            )}

            <div className="download-container">
                {!isUnlocked ? (
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter password"
                        />
                        <button onClick={handleUnlockDownload}>Unlock Download</button>
                    </div>
                ) : (
                    <button onClick={handleDownloadPhotos}>Download All Photos</button>
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;

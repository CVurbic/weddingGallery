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

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage, uploadTrigger]); // Fetch photos whenever storage or uploadTrigger changes

    useEffect(() => {
        const handleKeyPress = (event) => {
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
    }, [fullscreenPhoto]); // Listen for key events when fullscreenPhoto changes

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

    const handleDownloadAllPhotos = async () => {
        try {
            // Initialize an array to store image blob promises
            const blobPromises = [];

            // Iterate through each photo URL
            photos.forEach((photo, index) => {
                const fileRef = ref(storage, photo.path); // Assuming each photo object contains its path in Firebase Storage

                // Fetch the download URL for the photo
                const downloadUrlPromise = getDownloadURL(fileRef)
                    .then(url => {
                        // Fetch the image as a blob
                        return fetch(url)
                            .then(response => response.blob())
                            .then(blob => {
                                // Return the blob with the associated filename
                                return { blob, filename: `photo_${index}.jpg` };
                            });
                    });

                // Add the promise to the array
                blobPromises.push(downloadUrlPromise);
            });

            // Resolve all blob promises
            const blobs = await Promise.all(blobPromises);

            // Create a zip file using the resolved blobs
            const zip = new JSZip();
            blobs.forEach(({ blob, filename }) => {
                zip.file(filename, blob);
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
            console.error('Error downloading photos:', error);
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
            <button onClick={handleDownloadAllPhotos}>Download All Photos</button>
        </div>
    );
};

export default PhotoGallery;

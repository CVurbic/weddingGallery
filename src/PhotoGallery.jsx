import React, { useState, useEffect } from 'react';
import { useFirebase, getAllPhotos } from './firebase';
import { getDownloadURL, ref, getMetadata } from 'firebase/storage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './PhotoGallery.css'; // Import your CSS file for PhotoGallery
import JSZip from 'jszip';
import { IoMdLock } from 'react-icons/io';

const PhotoGallery = ({ uploadTrigger }) => {
    const { storage } = useFirebase();
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [password, setPassword] = useState('');
    const [showDownloadButton, setShowDownloadButton] = useState(false);

    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line
    }, [storage, uploadTrigger]);

    const fetchPhotos = async () => {
        try {
            const photoList = await getAllPhotos();
            const filteredPhotos = [];

            /* console.log("photoList")
            console.log(photoList) */

            // Fetch metadata and filter images based on filename and extension
            await Promise.all(photoList.map(async (path) => {
                //console.log(path)
                if (path.endsWith('200x200.webp')) {
                    const fileRef = ref(storage, path);
                    try {
                        const metadataSnapshot = await getMetadata(fileRef);
                        const creationTime = new Date(metadataSnapshot.timeCreated);
                        const downloadUrl = await getDownloadURL(fileRef);

                        let imageName = path.replace("_200x200.webp", "");
                        let realImage = photoList.find(i => i.includes(imageName) && !i.includes("200x200"))
                        let realImageRef = ref(storage, realImage);
                        let realImageDownloadUrl = await getDownloadURL(realImageRef);
                        filteredPhotos.push({ url: downloadUrl, path, creationTime, fullImageUrl: realImageDownloadUrl });
                    } catch (error) {
                        console.error('Error fetching metadata or download URL:', error.message);
                    }
                }
            }));

            // Sort images based on creation time
            filteredPhotos.sort((a, b) => b.creationTime - a.creationTime);

            /* console.log("filteredPhotos")
            console.log(filteredPhotos) */
            setPhotos(filteredPhotos);
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
            const zip = new JSZip();

            await Promise.all(photos.map(async (photo, index) => {
                const fileRef = ref(storage, photo.path);
                const url = await getDownloadURL(fileRef);
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(`photo_${index}.jpg`, blob);
            }));

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipBlob);

            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = 'photos.zip';
            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(zipUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading photos:', error);
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordSubmit = () => {
        // Check if the password is correct
        if (password === '27.01.2024') {
            setShowDownloadButton(true);
        } else {
            alert('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="photo-gallery-container">
            <h1>Photo Gallery</h1>
            <div className="photo-grid">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo.url}
                        alt={`${index}`}
                        className="gallery-photo"
                        loading='lazy'
                        onClick={() => handlePhotoClick(index)}
                    />
                ))}
            </div>
            {fullscreenPhoto && (
                <div>
                    <div className="fullscreen-overlay" onClick={handleCloseFullscreen}></div>
                    <div className="fullscreen-image-container">
                        <img src={fullscreenPhoto.fullImageUrl} alt="Fullscreen" className="fullscreen-photo" />
                    </div>
                    <IoIosArrowBack className="arrow-icon left-arrow" onClick={handlePreviousPhoto} />
                    <IoIosArrowForward className="arrow-icon right-arrow" onClick={handleNextPhoto} />
                </div>
            )}
            {showDownloadButton ? (
                <div className="password-input-container">
                    <button onClick={handleDownloadAllPhotos} className='password-btn'>Download All Photos</button>
                </div>
            ) : (
                <div className="password-input-container">
                    {password === '' ? (
                        <IoMdLock className="padlock-icon" onClick={() => setPassword('2')} />
                    ) : (
                        <>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="password-input"
                            />
                            <button onClick={handlePasswordSubmit} className="password-btn">
                                Submit
                            </button>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

export default PhotoGallery;

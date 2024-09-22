import React, { useState, useEffect } from 'react';
import { uploadPhoto } from '../services/firebase';
import { UPLOAD_BUTTON_TEXT, MAX_UPLOAD_SIZE, ALLOWED_FILE_TYPES } from '../constants';
import '../styles/PhotoUploader.css';
import imageCompression from 'browser-image-compression';

const PhotoUploader = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    let timer;
    if (uploadStatus) {
      timer = setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [uploadStatus]);

  const createThumbnail = async (file) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 200,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const thumbnailName = file.name.replace(/\.[^/.]+$/, "") + '_200x200.webp';
      return new File([compressedFile], thumbnailName, { type: 'image/webp' });
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);

    if (file.size > MAX_UPLOAD_SIZE) {
      console.log('File size exceeds limit');
      setUploadStatus({ type: 'error', message: 'File size exceeds the maximum limit.' });
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.log('Invalid file type');
      setUploadStatus({ type: 'error', message: 'Invalid file type.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      console.log('Starting upload...');
      const thumbnail = await createThumbnail(file);
      const [originalUpload, thumbnailUpload] = await Promise.all([
        uploadPhoto(file),
        uploadPhoto(thumbnail)
      ]);
      console.log('Upload completed:', originalUpload, thumbnailUpload);
      setUploadStatus({ type: 'success', message: 'Photo and thumbnail uploaded successfully!' });
      onUpload();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus({ type: 'error', message: 'Failed to upload photo. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="photo-uploader">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        id="photo-upload"
        className="file-input"
      />
      <label htmlFor="photo-upload" className="upload-button">
        <span className="upload-icon">+</span>
        <span className="upload-text">{UPLOAD_BUTTON_TEXT}</span>
      </label>
      {isUploading && <p className="upload-status">Uploading...</p>}
      {uploadStatus && (
        <p className={`upload-status ${uploadStatus.type}`}>
          {uploadStatus.message}
        </p>
      )}
    </div>
  );
};

export default PhotoUploader;

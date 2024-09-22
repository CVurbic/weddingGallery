import React, { useState, useEffect } from 'react';
import { uploadPhoto } from '../services/firebase';
import { UPLOAD_BUTTON_TEXT, MAX_UPLOAD_SIZE, ALLOWED_FILE_TYPES } from '../constants';
import '../styles/PhotoUploader.css';
import imageCompression from 'browser-image-compression';

// Add this constant at the top of your file
const MAX_FILES_PER_UPLOAD = 10;

const PhotoUploader = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      maxWidthOrHeight: 400,
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Add this check to limit the number of files
    if (files.length > MAX_FILES_PER_UPLOAD) {
      setUploadStatus({ type: 'error', message: `You can only upload up to ${MAX_FILES_PER_UPLOAD} files at once.` });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);

    const validFiles = files.filter(file => {
      if (file.size > MAX_UPLOAD_SIZE) {
        console.log(`File size exceeds limit: ${file.name}`);
        return false;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        console.log(`Invalid file type: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setUploadStatus({ type: 'error', message: 'No valid files to upload.' });
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const thumbnail = await createThumbnail(file);
        return Promise.all([
          uploadPhoto(file),
          uploadPhoto(thumbnail)
        ]);
      });

      const results = await Promise.all(uploadPromises);
      console.log('Uploads completed:', results);
      setUploadStatus({ type: 'success', message: `${results.length} photo(s) uploaded successfully!` });
      onUpload();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus({ type: 'error', message: 'Failed to upload photos. Please try again.' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
        multiple
      />
      <label htmlFor="photo-upload" className="upload-button">
        <span className="upload-icon">+</span>
        <span className="upload-text">{UPLOAD_BUTTON_TEXT}</span>
      </label>
      {isUploading && (
        <div className="upload-progress">
          <p className="upload-status">Uploading...</p>
          <progress value={uploadProgress} max="100"></progress>
        </div>
      )}
      {uploadStatus && (
        <p className={`upload-status ${uploadStatus.type}`}>
          {uploadStatus.message}
        </p>
      )}
    </div>
  );
};

export default PhotoUploader;

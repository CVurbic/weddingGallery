import "./style.css";
import React, { useState } from 'react';
import { useFirebase } from './firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { RiLoader4Line } from 'react-icons/ri'; // Import the loader icon

const PhotoUploader = ({ onUpload }) => {
  const { storage } = useFirebase();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    setSelectedFiles(files);

    try {
      if (files.length > 0) {
        setUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
        });
        await Promise.all(uploadPromises);
        setSelectedFiles([]);
        setUploading(false);
        // Notify the parent component that an upload has occurred
        onUpload();
      }
    } catch (error) {
      console.error('Error uploading files:', error.message);
      alert('File upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <label htmlFor="file-upload" className="custom-file-upload">
          <h2>{selectedFiles.length > 0 ? `${selectedFiles.length} photos selected` : 'Upload New Images'}</h2>
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} multiple />
      </div>
      {uploading && (
        <div className="uploading-icon">
          <RiLoader4Line className="loader-icon" />
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;

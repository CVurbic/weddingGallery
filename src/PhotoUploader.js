import "./style.css";
import React, { useState } from 'react';
import { useFirebase } from './firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { LuImagePlus } from "react-icons/lu";

const PhotoUploader = () => {
  const { storage } = useFirebase();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    try {
      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploadPromises = Array.from(selectedFiles).map(async (file) => {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
        });
        await Promise.all(uploadPromises);
        setSelectedFiles([]);
        setUploading(false);
      } else {
        alert('Please select files first.');
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
        {/* Render the label dynamically based on the number of selected files */}
        <label htmlFor="file-upload" className="custom-file-upload">
          <h2>{selectedFiles.length > 0 ? `${selectedFiles.length} photos selected` : 'Upload New Images'}</h2>
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} multiple />
      </div>
      <LuImagePlus onClick={handleUpload} disabled={uploading} className="uploadImgBtn" />
    </div>
  );
};

export default PhotoUploader;

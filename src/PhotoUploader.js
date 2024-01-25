// src/PhotoUploader.jsx
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
        alert('Files uploaded successfully!');
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
    <div className="">
      <div className="upload-box">
        <h2>Upload New Images</h2>

        <input id="file-upload" type="file" onChange={handleFileChange} multiple />

        <LuImagePlus onClick={handleUpload} disabled={uploading} width={50} />

      </div>
    </div>
  );
};

export default PhotoUploader;

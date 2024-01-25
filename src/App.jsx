import React, { useState } from 'react';
import PhotoGallery from './PhotoGallery';
import PhotoUploader from './PhotoUploader';
import weddingBG from './weddingBg.jpg'; // Import your wedding background image

function App() {
    const [uploadTrigger, setUploadTrigger] = useState(false);

    const handleUpload = () => {
        setUploadTrigger(!uploadTrigger); // Toggle the trigger to re-fetch photos
    };

    return (
        <div className='wrapper'>
            <img src={weddingBG} alt="bg" className='pozadina' />
            <header>
                <h1>Ulla & Christian</h1>
                <p>27. Siječnja 2024 </p>
                {/* You can add more text or information here */}
            </header>

            <PhotoUploader onUpload={handleUpload} />
            <PhotoGallery uploadTrigger={uploadTrigger} />

            <footer>
                <p>© 2024 Ulla and Christian</p>
            </footer>
        </div>
    )
}

export default App;

// App.jsx

import React from 'react';
import PhotoGallery from './PhotoGallery';
import PhotoUploader from './PhotoUploader';
import weddingBG from './weddingBg.jpg'; // Import your wedding background image

function App() {
    return (
        <div className='wrapper'>
            <img src={weddingBG} alt="bg" className='pozadina' />
            <header>
                <h1>Ulla & Christian</h1>
                <p>27. Siječanj 2024 </p>
                {/* You can add more text or information here */}
            </header>

            <PhotoUploader />
            <PhotoGallery />

            <footer>
                <p>© 2024 Ulla and Christian</p>
            </footer>
        </div>
    )
}

export default App;

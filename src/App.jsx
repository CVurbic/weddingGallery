import React, { useState, useCallback } from 'react';
import PhotoGallery from './components/PhotoGallery';
import PhotoUploader from './components/PhotoUploader';
import { COUPLE_NAMES, WEDDING_DATE, FOOTER_TEXT } from './constants';
import './styles/App.css';

const App = () => {
    const [uploadTrigger, setUploadTrigger] = useState(false);

    const handleUpload = useCallback(() => {
        setUploadTrigger(prev => !prev);
    }, []);

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1 className="couple-names">{COUPLE_NAMES}</h1>
                <p className="wedding-date">{WEDDING_DATE}</p>
            </header>

            <main className="app-main">
                <section className="welcome-section">
                    <h2>Welcome to Our Wedding Celebration</h2>
                    <p>We're delighted to share our special moments with you. Explore our photo gallery and feel free to add your own memories to our collection.</p>
                </section>

                <PhotoUploader onUpload={handleUpload} />
                <PhotoGallery uploadTrigger={uploadTrigger} />
            </main>

            <footer className="app-footer">
                <p>{FOOTER_TEXT}</p>
            </footer>
        </div>
    );
};

export default App;

import React from 'react'
import PhotoGallery from './PhotoGallery'
import PhotoUploader from './PhotoUploader'




function App() {
    return (
        <div className='wrapper'>
            <PhotoUploader />
            <PhotoGallery />
        </div>
    )
}

export default App
// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FirebaseProvider } from './firebase';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>
);

reportWebVitals();

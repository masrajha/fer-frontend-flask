import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Buat root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render aplikasi React
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
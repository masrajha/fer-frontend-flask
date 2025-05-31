import axios from 'axios';

const API_URL = 'https://fer-api.sipu.web.id/predict';

// Fungsi untuk prediksi emosi
export const predictEmotion = async (imageData) => {
  try {
    // Konversi base64 ke Blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Buat form data
    const formData = new FormData();
    formData.append('file', blob, 'emotion-image.jpg');

    // Kirim request ke API
    const result = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to predict emotion');
  }
};
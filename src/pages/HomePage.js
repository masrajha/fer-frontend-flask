import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import ImageUploader from '../components/ImageUploader';
import EmotionResult from '../components/EmotionResult';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictEmotion } from '../services/api'; // PASTIKAN IMPORT INI DITAMBAHKAN

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [imageSrc, setImageSrc] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = (image) => {
    setImageSrc(image);
    setEmotionData(null);
  };

  const handlePrediction = async (imageData) => {
    setIsLoading(true);
    try {
      const data = await predictEmotion(imageData); // Sekarang fungsi sudah terdefinisi
      setEmotionData(data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert(`Error during emotion prediction: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">Emotion Recognition System</h1>
        <p className="text-gray-600">Deteksi emosi wajah menggunakan AI</p>
      </header>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'camera' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('camera')}
          >
            📷 Ambil Foto
          </button>
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'upload' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload Gambar
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'camera' ? (
            <CameraCapture 
              onCapture={handleImageCapture} 
              onPredict={handlePrediction}
            />
          ) : (
            <ImageUploader 
              onUpload={handleImageCapture} 
              onPredict={handlePrediction}
            />
          )}
          
          {isLoading && <LoadingSpinner />}
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {imageSrc && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Preview Gambar</h3>
                <img 
                  src={imageSrc} 
                  alt="Preview" 
                  className="w-full h-64 object-contain border rounded-lg"
                />
              </div>
            )}
            
            <EmotionResult data={emotionData} />
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Emotion Recognition System | FER-2013 Model
      </footer>
    </div>
  );
};

export default HomePage;
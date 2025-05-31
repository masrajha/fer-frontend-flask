import React from 'react';

const EmotionResult = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Hasil Prediksi</h3>
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>Hasil prediksi akan muncul di sini</p>
        </div>
      </div>
    );
  }

  // Urutkan emosi berdasarkan confidence tertinggi
  const sortedEmotions = Object.entries(data.all_predictions)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Hasil Prediksi</h3>
      
      <div className="text-center mb-6">
        <div className="inline-block bg-indigo-100 rounded-full p-4 mb-3">
          <span className="text-4xl">{getEmoji(data.emotion)}</span>
        </div>
        <h4 className="text-2xl font-bold text-indigo-800">{data.emotion}</h4>
        <p className="text-gray-600">Confidence: {(data.confidence * 100).toFixed(1)}%</p>
      </div>

      <div className="space-y-3">
        {sortedEmotions.map(([emotion, confidence]) => (
          <div key={emotion} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{emotion}</span>
              <span className="text-gray-600">{(confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper untuk mendapatkan emoji berdasarkan emosi
const getEmoji = (emotion) => {
  const emojis = {
    'Angry': '😠',
    'Disgust': '🤢',
    'Fear': '😨',
    'Happy': '😄',
    'Sad': '😢',
    'Surprise': '😲',
    'Neutral': '😐'
  };
  return emojis[emotion] || '❓';
};

export default EmotionResult;
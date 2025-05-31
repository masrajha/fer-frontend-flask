import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-700 font-medium">Menganalisis emosi wajah...</p>
        <p className="text-gray-500 text-sm mt-1">Harap tunggu sebentar</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
import React, { useRef } from 'react';
import { processImageForModel } from '../utils/imageUtils';

const ImageUploader = ({ onUpload, onPredict }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi tipe file
        if (!file.type.match('image/jpeg|image/png|image/jpg')) {
            alert('Hanya format JPG, PNG, atau JPEG yang didukung');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageData = event.target.result;
            onUpload(imageData);

            try {
                // Proses untuk model
                const processedImage = await processImageForModel(imageData);
                onPredict(processedImage);
            } catch (error) {
                console.error('Image processing error:', error);
                alert('Error processing image');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <div
                className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition"
                onClick={() => fileInputRef.current.click()}
            >
                <div className="text-indigo-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-700 mb-1">Klik untuk memilih gambar atau tarik ke sini</p>
                <p className="text-gray-500 text-sm">Format: JPG, PNG, JPEG (Maks. 5MB)</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default ImageUploader;
import React, { useRef, useState, useEffect } from 'react';
import { processImageForModel } from '../utils/imageUtils';

const CameraCapture = ({ onCapture, onPredict }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    // Inisialisasi kamera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setIsCameraOn(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.');
        }
    };

    // Matikan kamera saat komponen di-unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Ambil foto dari kamera
    const capturePhoto = async () => {
        if (!isCameraOn) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Sesuaikan ukuran canvas dengan video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Gambar frame video ke canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Dapatkan data gambar
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);

        try {
            // Proses untuk model
            const processedImage = await processImageForModel(imageData);
            onPredict(processedImage);
        } catch (error) {
            console.error('Image processing error:', error);
            alert('Error processing image');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                {isCameraOn ? (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full max-w-md h-auto border-4 border-indigo-300 rounded-lg"
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
                            >
                                📸 Ambil Foto
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full max-w-md h-64 flex items-center justify-center">
                        <button
                            onClick={startCamera}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            🚀 Aktifkan Kamera
                        </button>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800">
                <p>Tips:</p>
                <ul className="list-disc pl-5 mt-1">
                    <li>Pastikan wajah menghadap kamera</li>
                    <li>Pencahayaan cukup dan tidak silau</li>
                    <li>Jarak wajah sekitar 30-50cm dari kamera</li>
                </ul>
            </div>
        </div>
    );
};

export default CameraCapture;
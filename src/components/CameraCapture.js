import React, { useRef, useState, useEffect } from 'react';
import { processImageForModel } from '../utils/imageUtils';

const CameraCapture = ({ onCapture, onPredict, disableCapture = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  // Dapatkan daftar kamera yang tersedia
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        setAvailableCameras(videoDevices);
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting camera devices:', err);
    }
  };

  // Inisialisasi kamera dengan perangkat yang dipilih
  const startCamera = async (deviceId) => {
    setIsLoading(true);
    setCameraError(null);
    console.log("📸 Memulai kamera dengan deviceId:", deviceId);

    try {
      if (stream) {
        stopCamera();
      }

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("✅ getUserMedia berhasil, stream:", mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        try {
          await videoRef.current.play();
          console.log("🎥 Video berhasil diputar (manual play)");
        } catch (err) {
          console.error("❌ Gagal memutar video:", err);
          setCameraError("Gagal memutar video. Periksa izin autoplay.");
          setIsLoading(false);
          return;
        }

        setStream(mediaStream);
        setIsCameraOn(true);

        videoRef.current.onloadedmetadata = () => {
          console.log("✅ Video metadata dimuat");
          const width = videoRef.current.videoWidth;
          const height = videoRef.current.videoHeight;
          console.log("📏 Video dimensions:", width, height);
          setVideoDimensions({ width, height });
          setIsLoading(false);
        };

        videoRef.current.onerror = (e) => {
          console.error("❌ VIDEO ERROR:", e);
          setCameraError("Video gagal ditampilkan");
          setIsLoading(false);
        };

        // Timeout safety: jika video tidak muncul dalam 5 detik
        setTimeout(() => {
          const width = videoRef.current?.videoWidth || 0;
          const height = videoRef.current?.videoHeight || 0;
          console.warn("⏰ Timeout 5s, video size:", width, height);
          if (width === 0 || height === 0) {
            setCameraError("Video tidak muncul, kemungkinan kamera tidak mengirim frame.");
            stopCamera();
            setIsLoading(false);
          }
        }, 5000);
      }
    } catch (err) {
      console.error("❌ Error getUserMedia:", err);
      handleCameraError(err);
      setIsLoading(false);
    }
  };

  // Penanganan error kamera
  const handleCameraError = (error) => {
    let errorMessage = 'Tidak dapat mengakses kamera';

    switch (error.name) {
      case 'NotReadableError':
        errorMessage = 'Kamera sedang digunakan oleh aplikasi lain';
        break;
      case 'OverconstrainedError':
        errorMessage = 'Resolusi tidak didukung, coba kamera lain';
        break;
      case 'NotFoundError':
        errorMessage = 'Tidak ditemukan perangkat kamera';
        break;
      case 'NotAllowedError':
        errorMessage = 'Izin akses kamera ditolak';
        break;
      default:
        errorMessage = `Error kamera: ${error.message}`;
    }

    setCameraError(errorMessage);
    stopCamera();
  };

  // Menghentikan kamera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Setup kamera saat komponen dimount
  useEffect(() => {
    getCameraDevices();

    return () => {
      stopCamera();
    };
  }, []);

  // Ambil foto dari kamera
  const capturePhoto = () => {
    if (disableCapture) return; // Disable fungsi jika prop disableCapture = true
    if (!isCameraOn || isLoading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Video belum siap, silakan coba lagi sebentar.');
      return;
    }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Tampilkan canvas sementara (debug)
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.maxWidth = '400px';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 3000);

    // Ambil data gambar dari canvas
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);

    // Proses gambar untuk model
    try {
      const processedImage = processImageForModel(imageData);
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
          <div className="relative w-full max-w-md">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {videoDimensions.width > 0 ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onError={(e) => {
                    console.error("Video error:", e);
                    setCameraError("Gagal menampilkan video dari kamera");
                    setIsLoading(false);
                  }}
                  className="w-full h-full object-contain"
                  style={{
                    transform: 'scaleX(-1)' // Mirror untuk kamera depan
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-white text-center">
                    <div className="mb-2">Mengaktifkan kamera...</div>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="text-white text-lg flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-2"></div>
                    Mengaktifkan kamera...
                  </div>
                </div>
              )}
            </div>

            {/* Camera Selector */}
            {availableCameras.length > 1 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Kamera:
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => startCamera(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  disabled={isLoading}
                >
                  {availableCameras.map((camera, index) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Kamera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Capture Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={capturePhoto}
                disabled={disableCapture || isLoading || videoDimensions.width === 0}
                className={`bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg transition ${
                  disableCapture || isLoading || videoDimensions.width === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
                title={disableCapture ? "Fitur ini masih dalam pengembangan" : "Ambil Foto"}
              >
                {videoDimensions.width > 0 ? '📸 Ambil Foto' : 'Menyiapkan...'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full max-w-md flex flex-col items-center justify-center p-6">
            <h3 className="text-lg font-medium mb-4">Aktifkan Kamera</h3>

            {/* Camera Selection */}
            {availableCameras.length > 0 ? (
              <>
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Kamera:
                  </label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {availableCameras.map((camera, index) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Kamera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => startCamera(selectedCamera)}
                  disabled={isLoading || disableCapture}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      Mengaktifkan...
                    </span>
                  ) : (
                    <span>🚀 Aktifkan Kamera</span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={getCameraDevices}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                🔍 Cari Perangkat Kamera
              </button>
            )}

            {cameraError && (
              <div className="mt-4 text-red-600 text-center bg-red-100 p-3 rounded-lg max-w-xs">
                {cameraError}
              </div>
            )}
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: 'none',
          maxWidth: '100%',
          border: '2px solid #4F46E5',
          borderRadius: '8px',
          margin: '0 auto'
        }}
      />

      <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800">
        <p className="font-medium">Panduan Penggunaan:</p>
        <ol className="list-decimal pl-5 mt-1 space-y-1">
          <li>Pilih kamera yang ingin digunakan</li>
          <li>Klik "Aktifkan Kamera"</li>
          <li>Tunggu hingga video kamera muncul</li>
          <li>Klik "Ambil Foto" untuk menangkap gambar</li>
          <li>Gambar akan muncul di bawah video untuk konfirmasi</li>
        </ol>
      </div>
    </div>
  );
};

export default CameraCapture;

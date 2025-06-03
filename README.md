# FER-Frontend: Facial Expression Recognition React Application

## Deskripsi Proyek

Proyek ini adalah aplikasi frontend berbasis React untuk mengimplementasikan model kecerdasan buatan (AI) dalam mendeteksi ekspresi wajah (facial expression recognition) menggunakan dataset **FER-2013**.

Aplikasi memungkinkan pengguna untuk mengunggah gambar wajah atau mengambil foto langsung melalui kamera perangkat, lalu mengirimkan gambar tersebut ke API prediksi emosi untuk mendapatkan hasil klasifikasi emosi wajah secara realtime.

## Struktur Proyek dan Fungsi Utama

- **App.js**  
  Root component React yang menampilkan halaman utama aplikasi dengan latar belakang gradasi warna.

- **CameraCapture.js**  
  Komponen untuk menangkap foto langsung dari kamera perangkat. Mendukung pemilihan kamera jika tersedia lebih dari satu, mengaktifkan dan mematikan kamera, serta mengambil gambar dan memprosesnya untuk prediksi.

- **ImageUploader.js**  
  Komponen untuk mengunggah gambar dari file lokal. Mendukung validasi format gambar (JPG, PNG, JPEG) dan melakukan preprocessing sebelum pengiriman ke API.

- **EmotionResult.js**  
  Komponen untuk menampilkan hasil prediksi emosi wajah secara interaktif. Menampilkan emosi dengan confidence tertinggi serta bar confidence untuk semua kelas emosi.

- **LoadingSpinner.js**  
  Komponen UI untuk menampilkan indikator loading selama proses prediksi berlangsung.

- **api.js**  
  Modul yang mengatur komunikasi dengan backend API (`https://fer-api.sipu.web.id/predict`). Mengirim gambar dalam format multipart/form-data dan menerima hasil prediksi emosi.

- **imageUtils.js**  
  Modul utilitas untuk preprocessing gambar, termasuk resize gambar ke ukuran 48x48 piksel sesuai kebutuhan model FER-2013.

- **package.json**  
  Daftar dependensi dan konfigurasi npm untuk proyek React ini.

- **tailwind.config.js**  
  Konfigurasi Tailwind CSS untuk styling komponen React.

## Fitur Utama

- Pengambilan gambar menggunakan kamera perangkat dengan pengaturan kamera yang mudah.
- Upload gambar wajah dari perangkat lokal dengan validasi tipe file.
- Preprocessing gambar secara otomatis agar sesuai input model (resize, format).
- Prediksi ekspresi wajah real-time melalui API backend.
- Tampilan hasil prediksi emosi yang informatif dan menarik secara visual.
- Penggunaan Tailwind CSS untuk UI responsif dan modern.

## Cara Menjalankan Proyek

1. Pastikan Node.js dan npm sudah terinstall di sistem Anda.
2. Clone atau download proyek ini.
3. Jalankan perintah untuk instalasi dependencies:
    ```bash
    npm install
    ```

4. Jalankan server development:

   ```bash
   npm start
   ```
5. Buka browser dan akses `http://localhost:3000` untuk menggunakan aplikasi.

## Referensi

* Dataset FER-2013: [https://www.kaggle.com/datasets/msambare/fer2013](https://www.kaggle.com/datasets/msambare/fer2013)
* TensorFlow Keras Model API (backend)
* Tailwind CSS: [https://tailwindcss.com/](https://tailwindcss.com/)
* React Documentation: [https://reactjs.org/](https://reactjs.org/)

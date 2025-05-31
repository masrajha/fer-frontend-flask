// Preprocessing gambar untuk model FER-2013
export const processImageForModel = (imageData) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Resize gambar ke 48x48 untuk model FER-2013
      const targetSize = 48;
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      // Gambar ulang dengan ukuran target
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      
      // Konversi ke format JPG
      const processedImage = canvas.toDataURL('image/jpeg', 0.8);
      resolve(processedImage);
    };
    
    // Handle error loading image
    img.onerror = () => {
      console.error('Error loading image');
      resolve(imageData); // Return original if error
    };
  });
};
'use client';

import { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function ProductImageGallery({ product = {} }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update images only when product changes
  useEffect(() => {
    if (!product) return;

    const imgs = [
      product.media1,
      product.media2,
      product.media3,
      product.media4,
      product.media5,
    ].filter(Boolean);

    setImages(prev => {
      const prevStr = prev.join(',');
      const newStr = imgs.join(',');
      return prevStr === newStr ? prev : imgs;
    });

    console.log('ProductImageGallery media URLs:', imgs.map(img => `${BASE_URL}/${img}`));
  }, [product]);

  // Auto-slide every 3s
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const goToImage = (index) => setCurrentIndex(index);

  if (!images.length) return <div className="text-center p-4">No images available</div>;

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden
                    w-full max-w-[520px] h-[300px] sm:h-[400px] md:w-[520px] md:h-[520px] mx-auto">
      {/* Big Image */}
      <div className="w-full h-full flex justify-center items-center p-2 sm:p-4">
        <img
          src={`${BASE_URL}/${images[currentIndex]}`}
          alt={`Product Image ${currentIndex + 1}`}
          className="object-contain rounded-lg w-full h-full"
        />
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 sm:bottom-3 w-full flex justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToImage(idx)}
            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-colors ${
              currentIndex === idx ? 'bg-green-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

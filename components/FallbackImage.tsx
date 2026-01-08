'use client';

import { useEffect, useState } from 'react';

interface FallbackImageProps {
  modelName: string;
  onReady: () => void;
}

export default function FallbackImage({ modelName, onReady }: FallbackImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = `/${modelName}.png`; // You'll need to add preview images
    img.onload = () => {
      setImageLoaded(true);
      // Start loading 3D model after image shows
      setTimeout(onReady, 500);
    };
  }, [modelName, onReady]);

  if (!imageLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src={`/${modelName}.png`}
        alt={modelName}
        className="max-h-[60%] max-w-[60%] object-contain opacity-60"
      />
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    </div>
  );
}

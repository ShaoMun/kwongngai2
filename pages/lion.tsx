'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';

interface LionImage {
  src: string;
  label: string;
}

const lionImages: LionImage[] = [
  { src: '/lion-4.jpeg', label: 'Southern Lion' },
  { src: '/lion-2.jpeg', label: 'High Pole' },
  { src: '/lion-5.jpeg', label: 'LED Lion' },
  { src: '/lion-3.jpeg', label: 'LED High Pole' },
  { src: '/lion-1.jpeg', label: 'Northern Lion' },
  { src: '/lion-6.jpeg', label: 'Mix & Match' },
];

export default function LionPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [justChangedIndex, setJustChangedIndex] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    setJustChangedIndex(true);
    setCurrentIndex((prev) => (prev + 1) % lionImages.length);
    setTimeout(() => setJustChangedIndex(false), 50);
  };

  const goToPrev = () => {
    setJustChangedIndex(true);
    setCurrentIndex((prev) => (prev - 1 + lionImages.length) % lionImages.length);
    setTimeout(() => setJustChangedIndex(false), 50);
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (dragOffset > threshold) goToPrev();
    else if (dragOffset < -threshold) goToNext();
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (dragOffset > threshold) goToPrev();
    else if (dragOffset < -threshold) goToNext();
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  const getDragProgress = () => {
    const maxDrag = 200;
    return Math.max(-1, Math.min(1, dragOffset / maxDrag));
  };

  const dragProgress = getDragProgress();
  const prevIndex = (currentIndex - 1 + lionImages.length) % lionImages.length;
  const nextIndex = (currentIndex + 1) % lionImages.length;
  const nextNextIndex = (currentIndex + 2) % lionImages.length;
  const prevPrevIndex = (currentIndex - 2 + lionImages.length) % lionImages.length;

  // Calculate position and opacity for current image during drag
  const getCurrentTransform = () => {
    return `translateX(${dragProgress * 100}%) scale(${1 - Math.abs(dragProgress) * 0.3})`;
  };

  const getCurrentOpacity = () => {
    return 1 - Math.abs(dragProgress) * 0.5;
  };

  return (
    <>
      <Head>
        <title>Lion Dance Gallery - Kwong Ngai Lion Dance</title>
        <meta name="description" content="Gallery showcasing the magnificent lion dance performances" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        <button onClick={handleBack} className="fixed top-4 left-4 z-[100] bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
          ← Back
        </button>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl pt-20 pb-8 overflow-hidden">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 text-center uppercase" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
            Lion Dance
          </h2>

          <div ref={carouselRef} className="relative w-full max-w-6xl mx-auto aspect-[16/9] select-none overflow-visible" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            {/* Far Previous (i-2) - Appears when dragging left */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: Math.max(0, Math.min(0.35, -dragProgress - 0.3)), transform: `translateX(${dragProgress * 50 - 150}%) scale(0.45)`, transition: (isDragging || justChangedIndex) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }}>
                <div className="relative w-[65%] h-[65%] max-w-[750px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={lionImages[prevPrevIndex].src} alt="Far Previous" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[prevPrevIndex].label}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous (i-1) - Always visible on left, more prominent */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: dragProgress > 0 ? 0.55 + Math.min(1, dragProgress) * 0.45 : 0.55 - Math.min(0.3, -dragProgress * 0.3), transform: `translateX(${dragProgress > 0 ? dragProgress * 70 - 75 : -75}%) scale(${0.65 + (dragProgress > 0 ? Math.min(1, dragProgress) * 0.35 : -Math.min(0.1, -dragProgress * 0.1))})`, transition: (isDragging || justChangedIndex) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 5 }}>
                <div className="relative w-[78%] h-[78%] max-w-[880px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={lionImages[prevIndex].src} alt="Previous" fill className="object-cover" sizes="(max-width: 768px) 100vw, 65vw" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-7 left-7 right-7">
                      <h3 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[prevIndex].label}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current (i) - Focused in center */}
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer" style={{ opacity: getCurrentOpacity(), transform: getCurrentTransform(), transition: (isDragging || justChangedIndex) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10 }} onClick={() => !isDragging && setIsModalOpen(true)}>
                <div className="relative w-[85%] h-[85%] max-w-[950px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={lionImages[currentIndex].src} alt={lionImages[currentIndex].label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 75vw" priority draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[currentIndex].label}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next (i+1) - Always visible on right, more prominent */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: dragProgress < 0 ? 0.55 + Math.min(1, -dragProgress) * 0.45 : 0.55 - Math.min(0.3, dragProgress * 0.3), transform: `translateX(${dragProgress < 0 ? dragProgress * 70 + 75 : 75}%) scale(${0.65 + (dragProgress < 0 ? Math.min(1, -dragProgress) * 0.35 : -Math.min(0.1, dragProgress * 0.1))})`, transition: (isDragging || justChangedIndex) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 5 }}>
                <div className="relative w-[78%] h-[78%] max-w-[880px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={lionImages[nextIndex].src} alt="Next" fill className="object-cover" sizes="(max-width: 768px) 100vw, 65vw" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-7 left-7 right-7">
                      <h3 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[nextIndex].label}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Far Next (i+2) - Appears when dragging left (towards next) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: Math.max(0, Math.min(0.35, -dragProgress - 0.3)), transform: `translateX(${dragProgress * 50 + 150}%) scale(0.45)`, transition: (isDragging || justChangedIndex) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }}>
                <div className="relative w-[65%] h-[65%] max-w-[750px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={lionImages[nextNextIndex].src} alt="Far Next" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" draggable={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[nextNextIndex].label}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className="flex justify-center gap-3 mt-8">
            {lionImages.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-400 hover:bg-gray-500 w-3'}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); goToPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] w-full">
              <Image src={lionImages[currentIndex].src} alt={lionImages[currentIndex].label} fill className="object-contain rounded-lg" sizes="(max-width: 640px) 100vw, 90vw" priority />
            </div>
            <div className="text-center mt-6">
              <h3 className="text-4xl font-bold text-white" style={{ fontFamily: "'Alfa Slab One', cursive" }}>{lionImages[currentIndex].label}</h3>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

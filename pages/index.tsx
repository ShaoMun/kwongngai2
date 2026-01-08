'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TabBar, { TabType } from '@/components/TabBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ContactModal from '@/components/ContactModal';
import { useGLTF } from '@react-three/drei';

// Dynamic import to avoid SSR issues with WebGL
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Model path mapping
const MODEL_PATHS = {
  lion: '/lion.glb',
  dragon: '/dragon.glb',
  winnings: '/trophy.glb',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('lion');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Preload all models in background
  useEffect(() => {
    // Preload Draco decoder first to avoid delay on first model load
    useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    // Then preload all models
    Object.values(MODEL_PATHS).forEach(path => {
      useGLTF.preload(path);
    });
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Glassmorphism Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Title below tab bar */}
      <div className="absolute top-28 left-8 z-0 max-w-[90%] sm:max-w-[100%] md:max-w-[100%]">
        <h1 className="text-6xl sm:text-7xl md:text-8xl text-gray-900 uppercase break-words leading-tight" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
          {activeTab === 'winnings' ? 'WINNINGS' : activeTab.toUpperCase()}
        </h1>
      </div>

      {/* Main Content - Full height 3D Viewer */}
      <main className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full mx-auto px-4">
          <Suspense fallback={<LoadingSpinner />}>
            <ModelViewer modelPath={MODEL_PATHS[activeTab]} />
          </Suspense>

          {/* Contact Us Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-black text-white text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-all relative"
              style={{
                fontFamily: "'Inter', sans-serif",
                animation: 'rainbowGlow 3s ease-in-out infinite'
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

'use client';

import { useState, Suspense, useEffect } from 'react';
import TabBar, { TabType } from '@/components/TabBar';
import ContactModal from '@/components/ContactModal';
import { useGLTF } from '@react-three/drei';
import ModelViewerWithProgress from '@/components/ModelViewerWithProgress';

// Model path mapping
const getModels = () => ({
  lion: '/lion.glb',
  dragon: '/dragon.glb',
  drum: '/drum.glb',
  winnings: '/trophy.glb',
});

const getMobileModels = () => ({
  lion: '/lion-mobile.glb',
  dragon: '/dragon-mobile.glb',
  drum: '/drum-mobile.glb',
  winnings: '/trophy-mobile.glb',
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('lion');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modelPaths, setModelPaths] = useState(getModels());
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if mobile and use mobile-optimized models
  useEffect(() => {
    setIsClient(true);

    const checkIsMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    setIsMobile(checkIsMobile);

    if (checkIsMobile) {
      setModelPaths(getMobileModels());
    } else {
      setModelPaths(getModels());
    }

    // Preload Draco decoder once at startup
    useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  }, []);

  // Mobile: Preload lion first, then other models after initial load
  useEffect(() => {
    if (!isMobile || activeTab !== 'lion') return;

    // Preload lion immediately on mobile
    useGLTF.preload(modelPaths.lion);

    // After 3 seconds, preload the other models
    const timeoutId = setTimeout(() => {
      useGLTF.preload(modelPaths.dragon);
      useGLTF.preload(modelPaths.drum);
      useGLTF.preload(modelPaths.winnings);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isMobile, activeTab, modelPaths]);

  // Desktop: Preload next model when user changes tab (predictive loading)
  useEffect(() => {
    if (isMobile) return; // Skip this on mobile, use the above logic instead

    const tabOrder: TabType[] = ['lion', 'dragon', 'drum', 'winnings'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextTab = tabOrder[(currentIndex + 1) % tabOrder.length];

    // Preload the next model in the sequence after 1 second
    const timeoutId = setTimeout(() => {
      useGLTF.preload(modelPaths[nextTab]);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [activeTab, modelPaths, isMobile]);

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Glassmorphism Tab Bar */}
      {isClient && <TabBar activeTab={activeTab} onTabChange={handleTabChange} modelPaths={modelPaths} isMobile={isMobile} />}

      {/* Fallback during SSR hydration */}
      {!isClient && <TabBar activeTab={activeTab} onTabChange={handleTabChange} modelPaths={getModels()} isMobile={false} />}

      {/* Title below tab bar */}
      <div className="absolute top-28 left-8 z-0 max-w-[90%] sm:max-w-[100%] md:max-w-[100%]">
        <h1 className="text-8xl sm:text-9xl md:text-9xl text-gray-900 uppercase break-words leading-tight" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
          {activeTab === 'winnings' ? 'WINNINGS' : activeTab.toUpperCase()}
        </h1>
      </div>

      {/* Main Content - Full height 3D Viewer */}
      <main className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full mx-auto px-4">
          <Suspense fallback={null}>
            <ModelViewerWithProgress modelPath={modelPaths[activeTab]} />
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

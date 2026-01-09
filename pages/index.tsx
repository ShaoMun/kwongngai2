'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('lion');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modelPaths, setModelPaths] = useState(getModels());
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopModelsLoaded, setDesktopModelsLoaded] = useState(false);
  const [dynamicFontSize, setDynamicFontSize] = useState<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleTrophyClick = () => {
    router.push('/winnings');
  };

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

  // Mobile: Preload active tab's model first, then all models after initial load
  useEffect(() => {
    if (!isMobile) return;

    // Preload the current active tab model immediately on mobile
    if (activeTab && modelPaths[activeTab]) {
      useGLTF.preload(modelPaths[activeTab]);
    }

    // After 0.05 second, preload all models and start loading desktop versions
    const timeoutId = setTimeout(() => {
      // Preload all mobile models
      useGLTF.preload(modelPaths.lion);
      useGLTF.preload(modelPaths.dragon);
      useGLTF.preload(modelPaths.drum);
      useGLTF.preload(modelPaths.winnings);

      // After all mobile models are loaded, start loading desktop versions silently
      const desktopModels = getModels();
      const loadDesktopModels = async () => {
        try {
          // Preload all desktop models into GLTF cache first
          // This ensures they're fully parsed and ready before switching
          await Promise.all([
            new Promise((resolve) => {
              useGLTF.preload(desktopModels.lion);
              // Small delay to ensure GLTF has started loading
              setTimeout(resolve, 100);
            }),
            new Promise((resolve) => {
              useGLTF.preload(desktopModels.dragon);
              setTimeout(resolve, 100);
            }),
            new Promise((resolve) => {
              useGLTF.preload(desktopModels.drum);
              setTimeout(resolve, 100);
            }),
            new Promise((resolve) => {
              useGLTF.preload(desktopModels.winnings);
              setTimeout(resolve, 100);
            })
          ]);

          // Additional delay to ensure all models are fully loaded into cache
          await new Promise(resolve => setTimeout(resolve, 500));

          // Replace mobile models with desktop models
          setModelPaths(desktopModels);
          setDesktopModelsLoaded(true);
        } catch (error) {
          console.warn('Failed to load desktop models, sticking with mobile versions:', error);
        }
      };

      loadDesktopModels();
    }, 50);

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

  // Calculate dynamic font size for mobile to consume 100% of width
  useEffect(() => {
    // Only calculate for mobile, desktop uses fixed font size
    if (!isMobile) {
      setDynamicFontSize(null);
      return;
    }

    const calculateFontSize = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;

      const containerWidth = titleElement.parentElement?.offsetWidth || window.innerWidth;
      // Mobile uses 100% of container width
      const targetWidth = containerWidth;

      console.log('Starting calculation - containerWidth:', containerWidth, 'targetWidth:', targetWidth, 'isMobile:', isMobile);

      // Create a canvas to measure text width accurately
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      const text = activeTab === 'winnings' ? 'WINNINGS' : activeTab.toUpperCase();
      const fontFamily = "'Alfa Slab One', cursive";

      // Binary search to find the optimal font size
      let min = 10;
      let max = 400;
      let bestFontSize = min;
      let fontSize = Math.floor((min + max) / 2);
      let iterations = 0;
      const maxIterations = 30;

      while (iterations < maxIterations && min <= max) {
        context.font = `${fontSize}px ${fontFamily}`;
        const currentWidth = context.measureText(text).width;

        if (currentWidth > targetWidth) {
          // Too big, reduce max
          max = fontSize - 1;
        } else {
          // Fits, save this as the best and try bigger
          bestFontSize = fontSize;
          min = fontSize + 1;
        }

        fontSize = Math.floor((min + max) / 2);
        iterations++;
      }

      // Use the best font size that fits
      const finalFontSize = bestFontSize;
      console.log('Dynamic font size calculated:', finalFontSize, 'for container width:', containerWidth, 'isMobile:', isMobile);
      setDynamicFontSize(finalFontSize);
    };

    // Wait for font to be loaded before calculating
    if (typeof document !== 'undefined') {
      document.fonts.ready.then(() => {
        calculateFontSize();
      });
    }

    // Recalculate on window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calculateFontSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [activeTab, isMobile]);

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
      <div className="absolute top-28 left-8 right-8 z-0">
        <h1
          ref={titleRef}
          className="text-gray-900 uppercase whitespace-nowrap leading-tight sm:text-9xl md:text-[12rem]"
          style={{
            fontFamily: "'Alfa Slab One', cursive",
            fontSize: isMobile && dynamicFontSize !== null ? `${dynamicFontSize}px` : undefined
          }}
        >
          {activeTab === 'winnings' ? 'WINNINGS' : activeTab.toUpperCase()}
        </h1>
      </div>

      {/* Main Content - Full height 3D Viewer */}
      <main className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full mx-auto">
          <Suspense fallback={null}>
            <ModelViewerWithProgress
              modelPath={modelPaths[activeTab]}
              isDesktopVersion={desktopModelsLoaded}
              onTrophyClick={activeTab === 'winnings' ? handleTrophyClick : undefined}
            />
          </Suspense>

          {/* Contact Us Button */}
          <div className="absolute bottom-24 sm:bottom-8 left-1/2 transform -translate-x-1/2">
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

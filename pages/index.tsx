'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import TabBar, { TabType } from '@/components/TabBar';
import LoadingSpinner from '@/components/LoadingSpinner';

// Dynamic import to avoid SSR issues with WebGL
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Model path mapping
const MODEL_PATHS = {
  lion: '/lion.glb',
  dragon: '/dragon.glb',
  achievement: '/trophy.glb',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('lion');

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
      <div className="absolute top-24 left-8 z-10">
        <h1 className="text-6xl text-gray-900 uppercase" style={{ fontFamily: "'Alfa Slab One', cursive" }}>
          {activeTab === 'achievement' ? 'ACHIEVEMENT' : activeTab.toUpperCase()}
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
            <button className="flowing-border text-xl font-bold uppercase tracking-wider" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
              Contact Us
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

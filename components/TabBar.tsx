'use client';

import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export type TabType = 'lion' | 'dragon' | 'drum' | 'winnings';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  modelPaths: Record<TabType, string>;
  isMobile: boolean;
}

export default function TabBar({ activeTab, onTabChange, modelPaths, isMobile }: TabBarProps) {
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

  // Desktop: Predictive preloading on hover
  useEffect(() => {
    if (isMobile) return; // Skip on mobile

    if (hoveredTab && hoveredTab !== activeTab) {
      useGLTF.preload(modelPaths[hoveredTab]);
    }
  }, [hoveredTab, activeTab, modelPaths, isMobile]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'lion', label: 'Lion' },
    { key: 'dragon', label: 'Dragon' },
    { key: 'drum', label: 'Drum' },
    { key: 'winnings', label: 'Winnings' },
  ];

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] sm:w-auto">
      <div className="glassmorphism-tabs flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-2 rounded-full w-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            onMouseEnter={() => setHoveredTab(tab.key)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`
              flex-1 min-w-0 px-3 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
              ${activeTab === tab.key
                ? 'bg-white text-black shadow-lg'
                : 'text-black hover:bg-white/20'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

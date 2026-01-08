'use client';

import { useState } from 'react';

export type TabType = 'lion' | 'dragon' | 'achievement';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'lion', label: 'Lion' },
    { key: 'dragon', label: 'Dragon' },
    { key: 'achievement', label: 'Achievement' },
  ];

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glassmorphism-tabs flex items-center gap-2 px-2 py-2 rounded-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${activeTab === tab.key
                ? 'bg-white text-black shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
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

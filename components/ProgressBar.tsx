'use client';

import { useState, useEffect } from 'react';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate progress bar smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-48 bg-gradient-to-br from-gray-50/90 to-gray-100/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
        {/* Progress bar container */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(displayProgress, 100)}%` }}
          />
        </div>

        {/* Percentage text */}
        <p className="text-black/70 text-sm font-semibold">
          {Math.round(displayProgress)}%
        </p>

        {/* Status text */}
        <p className="text-black/50 text-xs font-medium">
          {displayProgress < 30 ? 'Downloading...' :
           displayProgress < 70 ? 'Processing...' :
           displayProgress < 100 ? 'Almost ready...' :
           'Loading...'}
        </p>
      </div>
    </div>
  );
}

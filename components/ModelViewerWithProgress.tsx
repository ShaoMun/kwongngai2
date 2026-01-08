'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import ModelViewer from '@/components/ModelViewer';
import ProgressBar from '@/components/ProgressBar';

interface ModelViewerWithProgressProps {
  modelPath: string;
}

function ModelScene({ modelPath }: { modelPath: string }) {
  return <ModelViewer modelPath={modelPath} />;
}

export default function ModelViewerWithProgress({ modelPath }: ModelViewerWithProgressProps) {
  // Use drei's built-in progress hook
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const loadStartTime = useRef(Date.now());

  useEffect(() => {
    // Reset on model path change
    loadStartTime.current = Date.now();
    setIsFirstLoad(true);
    setDisplayProgress(0);
  }, [modelPath]);

  useEffect(() => {
    if (isFirstLoad && progress > 0) {
      setDisplayProgress(progress);

      if (progress >= 100) {
        // Add a small delay to show 100% before switching
        setTimeout(() => {
          setIsFirstLoad(false);
        }, 500);
      }
    } else if (!isFirstLoad) {
      setDisplayProgress(100);
    }
  }, [progress, isFirstLoad]);

  // Show progress bar for first load or when model changes
  if (isFirstLoad || displayProgress < 100) {
    return <ProgressBar progress={displayProgress} />;
  }

  return (
    <Suspense fallback={<ProgressBar progress={displayProgress} />}>
      <ModelScene modelPath={modelPath} />
    </Suspense>
  );
}

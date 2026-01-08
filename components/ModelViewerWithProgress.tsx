'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ModelViewer from '@/components/ModelViewer';
import ProgressBar from '@/components/ProgressBar';

interface ModelViewerWithProgressProps {
  modelPath: string;
}

export default function ModelViewerWithProgress({ modelPath }: ModelViewerWithProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const loadingManagerRef = useRef<THREE.LoadingManager | null>(null);

  useEffect(() => {
    // Reset loading state when model path changes
    setIsLoading(true);
    setProgress(0);

    // Create loading manager to track progress
    const manager = new THREE.LoadingManager();

    manager.onProgress = (url, loaded, total) => {
      const percentage = (loaded / total) * 100;
      // Scale progress: 0-80% for download, 80-100% for processing
      setProgress(percentage * 0.8);
    };

    manager.onLoad = () => {
      // Model loaded, now processing
      setProgress(85);
      setTimeout(() => setProgress(90), 100);
      setTimeout(() => setProgress(95), 200);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      }, 400);
    };

    manager.onError = (url) => {
      console.error('Error loading:', url);
      setProgress(0);
    };

    loadingManagerRef.current = manager;

    // Preload the model with progress tracking
    const loader = new GLTFLoader(manager);
    loader.load(modelPath);

    return () => {
      loadingManagerRef.current = null;
    };
  }, [modelPath]);

  if (isLoading) {
    return <ProgressBar progress={progress} />;
  }

  return <ModelViewer modelPath={modelPath} />;
}

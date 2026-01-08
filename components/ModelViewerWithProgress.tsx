'use client';

import { Suspense, useState, useEffect, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useProgress, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProgressBar from '@/components/ProgressBar';
import { getOptimalRenderingSettings } from '@/lib/modelLoader';

// Configure Draco decoder for compressed GLB files
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

type GLTFResult = any;

// Context to share progress state
const ProgressContext = createContext({ setProgress: (_: number) => {} });

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url) as GLTFResult;
  const { setProgress } = useContext(ProgressContext);

  // Update progress when scene loads
  useEffect(() => {
    if (scene) {
      setProgress(100);
    }
  }, [scene, setProgress]);

  // Enable shadow casting on all meshes
  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Trophy needs to be smaller, lion and dragon stay the same size
  // On mobile, reduce scale further to fit better
  const isTrophy = url.includes('trophy');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const scale = isTrophy ? (isMobile ? 1.6 : 1.8) : (isMobile ? 1.75 : 2.1);
  const position: [number, number, number] = isTrophy ? [0, -1.57, 0] : [0, -2, 0];

  return (
    <group scale={scale} position={position}>
      {/* Shadow plane that rotates with the model */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <shadowMaterial opacity={0.05} transparent />
      </mesh>

      <primitive object={scene} dispose={null} />
    </group>
  );
}

function Scene({ modelPath }: { modelPath: string }) {
  const { progress } = useProgress();
  const { setProgress } = useContext(ProgressContext);

  // Get optimal rendering settings based on device
  const settings = getOptimalRenderingSettings();

  // Forward progress to parent
  useEffect(() => {
    setProgress(progress);
  }, [progress, setProgress]);

  return (
    <>
      <ambientLight intensity={0.4} />

      {/* Top-down lighting for shadows - conditionally enabled */}
      {settings.enableShadows && (
        <directionalLight
          position={[0, 10, 0]}
          intensity={1}
          castShadow
          shadow-mapSize-width={settings.shadowMapSize}
          shadow-mapSize-height={settings.shadowMapSize}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
          shadow-radius={50}
          shadow-normalBias={1}
        />
      )}

      <Suspense fallback={null}>
        <Model url={modelPath} />
      </Suspense>

      {/* Strong front lighting - stationary, outside rotation */}
      <directionalLight position={[0, 0, 10]} intensity={1.2} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate={true}
        autoRotateSpeed={2.5}
      />
    </>
  );
}

interface ModelViewerWithProgressProps {
  modelPath: string;
}

export default function ModelViewerWithProgress({ modelPath }: ModelViewerWithProgressProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Get optimal rendering settings based on device
  const settings = getOptimalRenderingSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ProgressBar progress={0} />;
  }

  return (
    <ProgressContext.Provider value={{ setProgress }}>
      <div className="w-full h-full relative">
        {/* Progress bar overlay */}
        {progress < 100 && <ProgressBar progress={progress} />}

        {/* Canvas with optimized settings */}
        <Canvas
          shadows={settings.shadows}
          camera={{ position: [0, 1.5, 5], fov: 50 }}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 2,
            alpha: true,
            premultipliedAlpha: false,
            antialias: settings.antialias,
            powerPreference: 'high-performance',
          }}
          onCreated={(state) => {
            state.gl.setClearColor(0x000000, 0);
          }}
          dpr={[1, settings.pixelRatio]}
          style={{ background: 'transparent' }}
        >
          <Scene modelPath={modelPath} />
        </Canvas>
      </div>
    </ProgressContext.Provider>
  );
}

'use client';

import { Suspense, useState, useEffect, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useProgress, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProgressBar from '@/components/ProgressBar';
import { getOptimalRenderingSettings } from '@/lib/modelLoader';

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

  // Skip shadow processing on mobile for speed
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTrophy = url.includes('trophy');

  useEffect(() => {
    if (!isMobileDevice) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    // On mobile: make lion/dragon darker, trophy lighter by adjusting materials
    if (isMobileDevice) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;

          // For trophy: make it lighter (higher emissive and color)
          if (isTrophy) {
            // Increase emissive intensity to make it glow more
            if (material.emissive) {
              material.emissive.multiplyScalar(2.5);
            }
            // Brighten the base color
            if (material.color) {
              material.color.offsetHSL(0, 0, 0.25);
            }
          } else {
            // For lion/dragon: make them darker
            // Reduce emissive to make it less glowing
            if (material.emissive) {
              material.emissive.multiplyScalar(0.5);
            }
            // Darken the base color
            if (material.color) {
              material.color.offsetHSL(0, 0, -0.15);
            }
          }

          material.needsUpdate = true;
        }
      });
    }
  }, [scene, isMobileDevice, isTrophy]);

  // Trophy needs to be smaller, lion and dragon stay the same size
  // On mobile, reduce scale further to fit better
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const scale = isTrophy ? (isMobile ? 1.6 : 1.8) : (isMobile ? 1.75 : 2.1);
  const position: [number, number, number] = isTrophy ? [0, -1.57, 0] : [0, -2, 0];

  // Store model type in context for lighting adjustments
  useEffect(() => {
    // Store model type in a data attribute for the Scene component to read
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.modelType = isTrophy ? 'trophy' : 'other';
    }
  }, [isTrophy]);

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

  // Determine if mobile and model type
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTrophy = modelPath.includes('trophy');

  // Adjust lighting intensity based on model type and device
  // Mobile: lower intensity for lion/dragon, higher for trophy
  const ambientIntensity = isMobile ? (isTrophy ? 0.5 : 0.3) : 0.4;
  const frontLightIntensity = isMobile ? (isTrophy ? 1.5 : 0.9) : 1.2;
  const topLightIntensity = isMobile ? (isTrophy ? 1.2 : 0.8) : 1;

  return (
    <>
      <ambientLight intensity={ambientIntensity} />

      {/* Top-down lighting for shadows - conditionally enabled */}
      {settings.enableShadows && (
        <directionalLight
          position={[0, 10, 0]}
          intensity={topLightIntensity}
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
      <directionalLight position={[0, 0, 10]} intensity={frontLightIntensity} />

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
  const [canShowCanvas, setCanShowCanvas] = useState(false);

  // Get optimal rendering settings based on device
  const settings = getOptimalRenderingSettings();

  useEffect(() => {
    setMounted(true);
    // Delay canvas creation to prioritize loading
    const timer = setTimeout(() => setCanShowCanvas(true), 100);
    return () => clearTimeout(timer);
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
        {canShowCanvas && (
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
              stencil: false,
              depth: true,
              // Enable better memory management
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={(state) => {
              state.gl.setClearColor(0x000000, 0);
              // Dispose resources when unmounted
              return () => {
                state.gl.dispose();
                state.gl.forceContextLoss();
              };
            }}
            dpr={[1, settings.pixelRatio]}
            style={{ background: 'transparent' }}
            performance={{ min: 0.5 }}
          >
            <Scene modelPath={modelPath} />
          </Canvas>
        )}
      </div>
    </ProgressContext.Provider>
  );
}

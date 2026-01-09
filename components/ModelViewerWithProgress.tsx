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

function Model({ url, isDesktopVersion, onTrophyClick, onLionClick, onOthersClick, onDragonClick, onDrumClick }: { url: string; isDesktopVersion: boolean; onTrophyClick?: () => void; onLionClick?: () => void; onOthersClick?: () => void; onDragonClick?: () => void; onDrumClick?: () => void }) {
  const { scene } = useGLTF(url) as GLTFResult;
  const { setProgress } = useContext(ProgressContext);

  // Update progress when scene loads
  useEffect(() => {
    if (scene) {
      setProgress(100);
    }
  }, [scene, setProgress]);

  // Skip shadow processing on mobile for speed, unless desktop version is loaded
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 640;
  const shouldEnableShadows = isDesktopVersion || !isMobileDevice;
  const isTrophy = url.includes('trophy');
  const isDrum = url.includes('drum');
  const isLion = url.includes('lion');
  const isOthers = url.includes('others');
  const isDragon = url.includes('dragon');

  useEffect(() => {
    // Store original values to restore them
    const originalValues = new Map<THREE.Mesh, {
      emissive?: THREE.Color;
      color?: THREE.Color;
    }>();

    if (shouldEnableShadows) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    // On mobile: make lion/dragon darker, trophy lighter, drum stays default
    if (isMobileDevice) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;

          // Store original values before modification
          if (material.emissive) {
            originalValues.set(child, {
              emissive: material.emissive.clone(),
              color: material.color.clone()
            });
          }

          // For trophy: make it lighter (higher emissive and color)
          // Drum: keep default (no adjustments)
          if (isTrophy) {
            // Increase emissive intensity to make it glow more
            if (material.emissive) {
              material.emissive.multiplyScalar(2.5);
            }
            // Brighten the base color
            if (material.color) {
              material.color.offsetHSL(0, 0, 0.25);
            }
          } else if (!isDrum) {
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
          // Drum: no material adjustments - keep default

          material.needsUpdate = true;
        }
      });
    }

    return () => {
      // Restore original values when unmounting
      originalValues.forEach((values, mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (values.emissive && material.emissive) {
          material.emissive.copy(values.emissive);
        }
        if (values.color && material.color) {
          material.color.copy(values.color);
        }
        material.needsUpdate = true;
      });
    };
  }, [scene, isMobileDevice, isTrophy, isDrum]);

  // Trophy and drum need to be smaller, lion and dragon stay the same size
  // Drum is smallest of all, trophy is second
  // On mobile, reduce scale further to fit better
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const scale = isDrum ? (isMobile ? 1.3 : 1.6) : (isTrophy ? (isMobile ? 1.55 : 1.8) : (isMobile ? 1.75 : 2.1));
  const position: [number, number, number] = isDrum ? [0, -1.35, 0] : (isTrophy ? [0, -1.57, 0] : [0, -2, 0]);

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

      {/* Clickable wrapper for trophy, lion, dragon, drum, and others */}
      {(isTrophy && onTrophyClick) || (isLion && onLionClick) || (isOthers && onOthersClick) || (isDragon && onDragonClick) || (isDrum && onDrumClick) ? (
        <group onClick={isTrophy ? onTrophyClick : (isLion ? onLionClick : (isOthers ? onOthersClick : (isDragon ? onDragonClick : onDrumClick)))}>
          <primitive object={scene} dispose={null} />
        </group>
      ) : (
        <primitive object={scene} dispose={null} />
      )}
    </group>
  );
}

function Scene({ modelPath, isDesktopVersion, onTrophyClick, onLionClick, onOthersClick, onDragonClick, onDrumClick }: { modelPath: string; isDesktopVersion: boolean; onTrophyClick?: () => void; onLionClick?: () => void; onOthersClick?: () => void; onDragonClick?: () => void; onDrumClick?: () => void }) {
  const { progress } = useProgress();
  const { setProgress } = useContext(ProgressContext);

  // Get optimal rendering settings based on device
  let settings = getOptimalRenderingSettings();

  // When desktop version is loaded, override mobile shadow settings
  if (isDesktopVersion) {
    settings = {
      ...settings,
      shadows: true,
      enableShadows: true,
      shadowMapSize: 1024,
    };
  }

  // Forward progress to parent
  useEffect(() => {
    setProgress(progress);
  }, [progress, setProgress]);

  // Determine if mobile and model type
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTrophy = modelPath.includes('trophy');

  // Adjust lighting intensity based on model type and device
  // When desktop version is loaded, always use desktop lighting regardless of screen size
  const useDesktopLighting = isDesktopVersion || !isMobile;
  const ambientIntensity = useDesktopLighting ? 0.4 : (isTrophy ? 0.5 : 0.3);
  const frontLightIntensity = useDesktopLighting ? 1.2 : (isTrophy ? 1.5 : 0.9);
  const topLightIntensity = useDesktopLighting ? 1 : (isTrophy ? 1.2 : 0.8);

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
        <Model url={modelPath} isDesktopVersion={isDesktopVersion} onTrophyClick={onTrophyClick} onLionClick={onLionClick} onOthersClick={onOthersClick} onDragonClick={onDragonClick} onDrumClick={onDrumClick} />
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
  isDesktopVersion?: boolean;
  onTrophyClick?: () => void;
  onLionClick?: () => void;
  onOthersClick?: () => void;
  onDragonClick?: () => void;
  onDrumClick?: () => void;
}

export default function ModelViewerWithProgress({ modelPath, isDesktopVersion = false, onTrophyClick, onLionClick, onOthersClick, onDragonClick, onDrumClick }: ModelViewerWithProgressProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [canShowCanvas, setCanShowCanvas] = useState(false);

  // Return early if modelPath is not provided
  if (!modelPath) {
    return <ProgressBar progress={0} />;
  }

  // Get optimal rendering settings based on device
  const settings = getOptimalRenderingSettings();

  // Lower camera position for drum model
  const isDrum = modelPath.includes('drum');
  const cameraPosition = isDrum ? [0, 2.5, 5] as [number, number, number] : [0, 1.5, 5] as [number, number, number];

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
            camera={{ position: cameraPosition, fov: 50 }}
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
            <Scene modelPath={modelPath} isDesktopVersion={isDesktopVersion} onTrophyClick={onTrophyClick} onLionClick={onLionClick} onOthersClick={onOthersClick} onDragonClick={onDragonClick} onDrumClick={onDrumClick} />
          </Canvas>
        )}
      </div>
    </ProgressContext.Provider>
  );
}

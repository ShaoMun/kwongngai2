'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Configure Draco decoder for compressed GLB files
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

type GLTFResult = any;

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url) as GLTFResult;
  console.log('Model loaded:', url);

  // Enable shadow casting on all meshes - memoized to run once
  const processedScene = useMemo(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return scene;
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

      <primitive object={processedScene} dispose={null} />
    </group>
  );
}

interface ModelViewerProps {
  modelPath: string;
}

export default function ModelViewer({ modelPath }: ModelViewerProps) {
  console.log('ModelViewer rendering with path:', modelPath);

  // Detect mobile for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const shadowMapSize = isMobile ? 512 : 1024;

  return (
    <div className="w-full h-full">
      <Canvas
        shadows={isMobile ? false : true}
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 2,
          alpha: true,
          premultipliedAlpha: false,
          antialias: !isMobile,
          powerPreference: 'high-performance',
        }}
        onCreated={(state) => {
          console.log('Canvas created');
          state.gl.setClearColor(0x000000, 0);
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        {/* Top-down lighting for shadows - disabled on mobile for performance */}
        {!isMobile && (
          <directionalLight
            position={[0, 10, 0]}
            intensity={1}
            castShadow
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
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

        <group>
          <Suspense fallback={null}>
            <Model url={modelPath} />
          </Suspense>
        </group>

        {/* Strong front lighting - stationary, outside rotation */}
        <directionalLight
          position={[0, 0, 10]}
          intensity={1.2}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={true}
          autoRotateSpeed={2.5}
        />
      </Canvas>
    </div>
  );
}

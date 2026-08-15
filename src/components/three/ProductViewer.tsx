"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ProductViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  onClose: () => void;
}

function Model({ url, autoRotate }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current && scene) {
      meshRef.current.clear();
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      meshRef.current.add(scene.clone());
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return <group ref={meshRef} />;
}

function Spinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  );
}

export default function ProductViewer({
  modelUrl,
  autoRotate = true,
  onClose,
}: ProductViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative h-full w-full">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close viewer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={containerRef} className="h-full w-full">
          <Canvas
            shadows
            camera={{ position: [3, 2, 3], fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
            className="h-full w-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <Suspense fallback={<Spinner />}>
              <Model url={modelUrl} autoRotate={autoRotate} />
              <Environment preset="city" />
              <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={1}
                maxDistance={20}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
              />
            </Suspense>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <shadowMaterial opacity={0.3} />
            </mesh>
          </Canvas>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* =========================================================
   SCREEN CODE LINE
========================================================= */

function CodeLine({
  x,
  y,
  width,
  opacity = 1,
}: {
  x: number;
  y: number;
  width: number;
  opacity?: number;
}) {
  return (
    <mesh position={[x, y, 0.011]}>
      <planeGeometry args={[width, 0.025]} />
      <meshBasicMaterial
        color="#22D3EE"
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
}

/* =========================================================
   LAPTOP MODEL
========================================================= */

function LaptopModel() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    // Full 360 self rotation
    group.current.rotation.y += delta * 0.45;

    // Small floating / presentation motion
    group.current.rotation.x = -0.055 + Math.sin(t * 0.45) * 0.012;
    group.current.rotation.z = Math.sin(t * 0.35) * 0.01;
    group.current.position.y = Math.sin(t * 0.75) * 0.035;
  });

  return (
    <group
      ref={group}
      scale={0.92}
      position={[0, -0.05, 0]}
      rotation={[-0.055, -0.22, 0]}
    >
      {/* =====================================================
          SCREEN / LID
      ====================================================== */}
      <group position={[0, 0.35, -0.43]} rotation={[-0.1, 0, 0]}>
        {/* outer lid */}
        <mesh>
          <boxGeometry args={[2.34, 1.43, 0.085]} />
          <meshStandardMaterial
            color="#47515F"
            roughness={0.28}
            metalness={0.72}
          />
        </mesh>

        {/* inner bezel */}
        <mesh position={[0, 0, 0.048]}>
          <boxGeometry args={[2.18, 1.27, 0.018]} />
          <meshStandardMaterial
            color="#11161D"
            roughness={0.45}
            metalness={0.35}
          />
        </mesh>

        {/* screen */}
        <mesh position={[0, 0, 0.059]}>
          <planeGeometry args={[2.02, 1.1]} />
          <meshBasicMaterial color="#07171E" toneMapped={false} />
        </mesh>

        {/* screen cyan wash */}
        <mesh position={[0, 0, 0.064]}>
          <planeGeometry args={[2.02, 1.1]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={0.075}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* title bar */}
        <mesh position={[0, 0.36, 0.071]}>
          <planeGeometry args={[1.82, 0.012]} />
          <meshBasicMaterial color="#4B6474" transparent opacity={0.7} />
        </mesh>

        {/* screen dots */}
        {[
          [-0.82, 0.44, "#22D3EE"],
          [-0.73, 0.44, "#60A5FA"],
          [-0.64, 0.44, "#94A3B8"],
        ].map(([x, y, color], index) => (
          <mesh key={index} position={[x as number, y as number, 0.071]}>
            <circleGeometry args={[0.022, 18]} />
            <meshBasicMaterial color={color as string} toneMapped={false} />
          </mesh>
        ))}

        {/* code */}
        <group position={[-0.74, 0.16, 0.071]}>
          <CodeLine x={0.24} y={0.08} width={0.48} opacity={1} />
          <CodeLine x={0.48} y={-0.08} width={0.94} opacity={0.72} />
          <CodeLine x={0.35} y={-0.24} width={0.68} opacity={0.92} />
          <CodeLine x={0.58} y={-0.4} width={1.14} opacity={0.62} />
          <CodeLine x={0.42} y={-0.56} width={0.82} opacity={0.82} />
        </group>

        {/* webcam */}
        <mesh position={[0, 0.655, 0.048]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color="#0A0D12" />
        </mesh>
      </group>

      {/* =====================================================
          BASE
      ====================================================== */}
      <group position={[0, -0.56, 0.2]}>
        {/* base */}
        <mesh>
          <boxGeometry args={[2.42, 0.105, 1.52]} />
          <meshStandardMaterial
            color="#414B58"
            roughness={0.3}
            metalness={0.76}
          />
        </mesh>

        {/* keyboard deck */}
        <mesh position={[0, 0.065, -0.02]}>
          <boxGeometry args={[2.3, 0.026, 1.38]} />
          <meshStandardMaterial
            color="#2B333D"
            roughness={0.35}
            metalness={0.58}
          />
        </mesh>

        {/* keyboard */}
        <group position={[0, 0.092, -0.2]}>
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 11 }).map((__, col) => (
              <mesh
                key={`${row}-${col}`}
                position={[-0.89 + col * 0.178, 0, -0.37 + row * 0.155]}
              >
                <boxGeometry args={[0.128, 0.015, 0.09]} />
                <meshStandardMaterial
                  color="#0F141A"
                  roughness={0.55}
                  metalness={0.28}
                />
              </mesh>
            ))
          )}
        </group>

        {/* trackpad */}
        <mesh position={[0, 0.093, 0.45]}>
          <boxGeometry args={[0.76, 0.01, 0.39]} />
          <meshStandardMaterial
            color="#596473"
            roughness={0.34}
            metalness={0.55}
          />
        </mesh>

        {/* cyan front edge */}
        <mesh position={[0, 0, 0.765]}>
          <boxGeometry args={[1.3, 0.018, 0.015]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={0.58}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* =========================================================
   SCENE
========================================================= */

function Scene() {
  return (
    <>
      {/* enough ambient light to reveal the laptop body */}
      <ambientLight intensity={1.65} />

      {/* focused top/front spotlight */}
      <spotLight
        position={[1.7, 4.8, 4.6]}
        intensity={58}
        angle={0.34}
        penumbra={0.78}
        decay={1.8}
        distance={11}
        color="#FFFFFF"
      />

      {/* soft front fill */}
      <directionalLight position={[3.6, 2.8, 5]} intensity={3.0} color="#EAF2FF" />

      {/* cyan rim */}
      <pointLight
        position={[-3.2, 0.7, 2.6]}
        intensity={25}
        distance={9}
        color="#22D3EE"
      />

      {/* blue rear separation */}
      <pointLight
        position={[2.6, 1.6, -3]}
        intensity={16}
        distance={8}
        color="#60A5FA"
      />

      {/* subtle floor glow */}
      <mesh position={[0, -1.18, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshBasicMaterial
          color="#22D3EE"
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <LaptopModel />
    </>
  );
}

/* =========================================================
   DROP-IN REPLACEMENT
========================================================= */

export default function EarthGlobe() {
  return (
    <div
      className="relative h-full w-full"
      aria-label="Animated 3D developer laptop"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [3.1, 1.35, 5.5],
          fov: 27,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.14;
          camera.lookAt(0, -0.08, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
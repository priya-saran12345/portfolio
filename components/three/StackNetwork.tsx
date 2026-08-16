"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

type NodeDef = {
  id: string;
  label: string;
  position: [number, number, number];
  size: number;
};

const NODES: NodeDef[] = [
  { id: "react", label: "React", position: [-2.9, 1.1, 0.5], size: 0.17 },
  { id: "next", label: "Next.js", position: [-1.45, 2.35, -0.75], size: 0.15 },
  { id: "typescript", label: "TypeScript", position: [-0.15, 1.65, 1.4], size: 0.16 },
  { id: "tailwind", label: "Tailwind", position: [-3.05, -0.45, -0.85], size: 0.14 },
  { id: "redux", label: "Redux", position: [-1.75, -1.55, 0.85], size: 0.14 },
  { id: "reactnative", label: "React Native", position: [-2.75, 2.15, 1.35], size: 0.14 },
  { id: "api", label: "REST API", position: [0, 0.35, -1.55], size: 0.18 },
  { id: "node", label: "Node.js", position: [0.45, -1.65, 0.8], size: 0.17 },
  { id: "express", label: "Express", position: [2.05, -0.55, -0.65], size: 0.14 },
  { id: "mongo", label: "MongoDB", position: [2.45, 0.65, 1.15], size: 0.17 },
  { id: "sql", label: "SQL Server", position: [3.05, -1.45, 0.35], size: 0.15 },
  { id: "postgres", label: "PostgreSQL", position: [2.8, 1.85, -0.7], size: 0.15 },
  { id: "git", label: "Git", position: [-0.65, -2.45, -1.0], size: 0.13 },
  { id: "docker", label: "Docker", position: [0.9, 2.55, 0.35], size: 0.15 },
  { id: "vercel", label: "Vercel", position: [1.85, 1.8, 1.45], size: 0.13 },
  { id: "render", label: "Render", position: [3.25, 0.05, -1.25], size: 0.13 },
];

const EDGES: [string, string][] = [
  ["react", "next"],
  ["react", "typescript"],
  ["react", "tailwind"],
  ["react", "redux"],
  ["react", "reactnative"],
  ["next", "typescript"],
  ["next", "api"],
  ["tailwind", "next"],
  ["redux", "api"],
  ["typescript", "api"],
  ["reactnative", "api"],
  ["api", "node"],
  ["api", "express"],
  ["node", "express"],
  ["express", "mongo"],
  ["express", "sql"],
  ["express", "postgres"],
  ["node", "mongo"],
  ["node", "sql"],
  ["typescript", "docker"],
  ["node", "docker"],
  ["docker", "vercel"],
  ["docker", "render"],
  ["next", "vercel"],
  ["api", "render"],
  ["git", "react"],
  ["git", "node"],
  ["git", "docker"],
];

function nodeById(id: string) {
  const node = NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Missing StackNetwork node: ${id}`);
  return node;
}

function FlowParticle({
  from,
  to,
  speed,
  offset,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = (clock.getElapsedTime() * speed + offset) % 1;
    ref.current.position.lerpVectors(from, to, t);

    const pulse = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.55 + pulse * 0.75);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
    </mesh>
  );
}

function SkillNode({ node, index }: { node: NodeDef; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (meshRef.current) {
      const scale = 1 + Math.sin(time * 1.15 + index * 0.7) * 0.06;
      meshRef.current.scale.setScalar(scale);
    }

    if (ringRef.current) {
      const scale = 1.6 + (Math.sin(time * 0.8 + index) + 1) * 0.18;
      ringRef.current.scale.setScalar(scale);

      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity =
        0.045 + (Math.sin(time * 0.8 + index) + 1) * 0.02;
    }
  });

  return (
    <group position={node.position}>
      <mesh ref={ringRef}>
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={meshRef}>
        <sphereGeometry args={[node.size, 28, 28]} />
        <meshStandardMaterial
          color="#F5F5F5"
          emissive="#FFFFFF"
          emissiveIntensity={0.32}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      <Html
        position={[0, node.size + 0.22, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.05em",
            color: "#FFFFFF",
            background: "rgba(0,0,0,0.72)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
            borderRadius: "999px",
            padding: "3px 7px",
            whiteSpace: "nowrap",
            backdropFilter: "blur(8px)",
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function NetworkCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.08;
      outerRef.current.rotation.y = t * 0.12;
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04);
    }
  });

  return (
    <group position={[0, 0.35, -1.55]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      <mesh ref={innerRef}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene() {
  const networkRef = useRef<THREE.Group>(null);

  const edgeVectors = useMemo(
    () =>
      EDGES.map(([a, b]) => {
        const start = nodeById(a);
        const end = nodeById(b);

        return {
          id: `${a}-${b}`,
          from: new THREE.Vector3(...start.position),
          to: new THREE.Vector3(...end.position),
        };
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (!networkRef.current) return;

    const time = clock.getElapsedTime();

    // Automatic movement only — no mouse/touch controls.
    networkRef.current.rotation.y += delta * 0.08;
    networkRef.current.rotation.z = Math.sin(time * 0.16) * 0.018;
    networkRef.current.position.y = Math.sin(time * 0.35) * 0.055;
  });

  return (
    <>
      <ambientLight intensity={0.65} />

      <pointLight position={[4, 4, 5]} intensity={32} color="#FFFFFF" />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#FFFFFF" />
      <pointLight position={[0, 0, -4]} intensity={12} color="#FFFFFF" />

      <group ref={networkRef} scale={0.68}>
        <mesh>
          <icosahedronGeometry args={[3.0, 2]} />
          <meshBasicMaterial
            color="#FFFFFF"
            wireframe
            transparent
            opacity={0.025}
            depthWrite={false}
          />
        </mesh>

        {EDGES.map(([a, b]) => {
          const start = nodeById(a);
          const end = nodeById(b);

          return (
            <Line
              key={`${a}-${b}`}
              points={[start.position, end.position]}
              color="#FFFFFF"
              lineWidth={0.8}
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          );
        })}

        {edgeVectors.map((edge, index) => (
          <FlowParticle
            key={edge.id}
            from={edge.from}
            to={edge.to}
            speed={0.12 + (index % 4) * 0.025}
            offset={index / edgeVectors.length}
          />
        ))}

        {NODES.map((node, index) => (
          <SkillNode key={node.id} node={node} index={index} />
        ))}

        <NetworkCore />
      </group>
    </>
  );
}

export default function StackNetwork() {
  return (
    <div
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-label="Technology network"
    >
      <Canvas
        camera={{
          position: [0, 0, 9.2],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

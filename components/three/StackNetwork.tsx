"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * StackNetwork
 * A literal visualization of the MERN stack: labeled nodes (React, Next.js,
 * Node.js, Express, MongoDB) connected by edges, with particles that travel
 * along the edges like data/API calls. Slowly rotates and responds to
 * pointer movement (parallax tilt) and pointer drag (manual rotate).
 */

type NodeDef = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  size: number;
};

const NODES: NodeDef[] = [
  { id: "react", label: "React", position: [-2.6, 1.1, 0.4], color: "#6C7CFF", size: 0.16 },
  { id: "next", label: "Next.js", position: [-1.0, 2.1, -0.6], color: "#E8EAED", size: 0.13 },
  { id: "node", label: "Node.js", position: [0.4, -1.6, 0.8], color: "#4EF0C4", size: 0.16 },
  { id: "express", label: "Express", position: [2.2, 0.4, -0.3], color: "#7C8798", size: 0.12 },
  { id: "mongo", label: "MongoDB", position: [1.4, -0.6, 1.4], color: "#4EF0C4", size: 0.18 },
  { id: "api", label: "REST API", position: [0.0, 0.6, -1.6], color: "#6C7CFF", size: 0.1 },
];

const EDGES: [string, string][] = [
  ["react", "next"],
  ["react", "api"],
  ["next", "api"],
  ["api", "node"],
  ["node", "express"],
  ["express", "mongo"],
  ["node", "mongo"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function Particle({ from, to, speed, offset }: { from: THREE.Vector3; to: THREE.Vector3; speed: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    ref.current.position.lerpVectors(from, to, t);
    const s = Math.sin(t * Math.PI); // fade in/out along the path
    ref.current.scale.setScalar(0.5 + s * 0.8);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#4EF0C4" toneMapped={false} />
    </mesh>
  );
}

function Node({ node }: { node: NodeDef }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const bob = Math.sin(clock.getElapsedTime() * 0.6 + node.position[0]) * 0.06;
    ref.current.position.y = node.position[1] + bob;
  });
  return (
    <group>
      <mesh ref={ref} position={node.position}>
        <sphereGeometry args={[node.size, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <Html position={[node.position[0], node.position[1] + node.size + 0.22, node.position[2]]} center distanceFactor={8}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: "#E8EAED",
            background: "rgba(10,13,19,0.55)",
            border: "1px solid rgba(232,234,237,0.12)",
            borderRadius: "4px",
            padding: "2px 6px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const dragState = useRef({ dragging: false, lastX: 0, rotY: 0, rotX: 0 });

  const edgeVectors = useMemo(
    () =>
      EDGES.map(([a, b]) => {
        const na = nodeById(a);
        const nb = nodeById(b);
        return {
          from: new THREE.Vector3(...na.position),
          to: new THREE.Vector3(...nb.position),
        };
      }),
    []
  );

  useFrame(() => {
    if (!group.current) return;
    const d = dragState.current;
    // gentle autorotation plus pointer parallax, blended with manual drag offset
    const idle = performance.now() * 0.00006;
    group.current.rotation.y = idle + d.rotY + pointer.x * 0.25;
    group.current.rotation.x = d.rotX + -pointer.y * 0.12;
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        dragState.current.dragging = true;
        dragState.current.lastX = e.clientX;
      }}
      onPointerUp={() => (dragState.current.dragging = false)}
      onPointerLeave={() => (dragState.current.dragging = false)}
      onPointerMove={(e) => {
        const d = dragState.current;
        if (!d.dragging) return;
        const delta = e.clientX - d.lastX;
        d.rotY += delta * 0.005;
        d.lastX = e.clientX;
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={40} color="#4EF0C4" />
      <pointLight position={[-3, -2, -2]} intensity={25} color="#6C7CFF" />

      {EDGES.map(([a, b], i) => {
        const na = nodeById(a);
        const nb = nodeById(b);
        return (
          <Line
            key={i}
            points={[na.position, nb.position]}
            color="#3A4353"
            lineWidth={1}
            transparent
            opacity={0.7}
          />
        );
      })}

      {edgeVectors.map((e, i) => (
        <Particle key={i} from={e.from} to={e.to} speed={0.18 + (i % 3) * 0.06} offset={i / edgeVectors.length} />
      ))}

      {NODES.map((n) => (
        <Node key={n.id} node={n} />
      ))}
    </group>
  );
}

export default function StackNetwork() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

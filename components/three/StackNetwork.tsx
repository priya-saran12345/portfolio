"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   TYPES
========================================================= */

type NodeDef = {
  id: string;
  label: string;
  position: [number, number, number];
  size: number;
};

/* =========================================================
   NODES
========================================================= */

const NODES: NodeDef[] = [
  {
    id: "react",
    label: "React",
    position: [-2.9, 1.1, 0.5],
    size: 0.17,
  },
  {
    id: "next",
    label: "Next.js",
    position: [-1.45, 2.35, -0.75],
    size: 0.15,
  },
  {
    id: "typescript",
    label: "TypeScript",
    position: [-0.15, 1.65, 1.4],
    size: 0.16,
  },
  {
    id: "tailwind",
    label: "Tailwind",
    position: [-3.05, -0.45, -0.85],
    size: 0.14,
  },
  {
    id: "redux",
    label: "Redux",
    position: [-1.75, -1.55, 0.85],
    size: 0.14,
  },
  {
    id: "reactnative",
    label: "React Native",
    position: [-2.75, 2.15, 1.35],
    size: 0.14,
  },

  {
    id: "api",
    label: "REST API",
    position: [0, 0.35, -1.55],
    size: 0.18,
  },

  {
    id: "node",
    label: "Node.js",
    position: [0.45, -1.65, 0.8],
    size: 0.17,
  },
  {
    id: "express",
    label: "Express",
    position: [2.05, -0.55, -0.65],
    size: 0.14,
  },

  {
    id: "mongo",
    label: "MongoDB",
    position: [2.45, 0.65, 1.15],
    size: 0.17,
  },
  {
    id: "sql",
    label: "SQL Server",
    position: [3.05, -1.45, 0.35],
    size: 0.15,
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    position: [2.8, 1.85, -0.7],
    size: 0.15,
  },

  {
    id: "git",
    label: "Git",
    position: [-0.65, -2.45, -1.0],
    size: 0.13,
  },
  {
    id: "docker",
    label: "Docker",
    position: [0.9, 2.55, 0.35],
    size: 0.15,
  },
  {
    id: "vercel",
    label: "Vercel",
    position: [1.85, 1.8, 1.45],
    size: 0.13,
  },
  {
    id: "render",
    label: "Render",
    position: [3.25, 0.05, -1.25],
    size: 0.13,
  },
];

/* =========================================================
   CONNECTIONS
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

function nodeById(id: string) {
  const node = NODES.find((item) => item.id === id);

  if (!node) {
    throw new Error(
      `Missing StackNetwork node: ${id}`
    );
  }

  return node;
}

/* =========================================================
   FORCE TRANSPARENT THREE.JS CANVAS

   This is important because ScrollCharacter sits behind
   this component.
========================================================= */

function TransparentCanvasSetup() {
  const { gl, scene } = useThree();

  useEffect(() => {
    /*
     * No Three.js background.
     */
    scene.background = null;

    /*
     * Clear framebuffer using alpha = 0.
     */
    gl.setClearColor(
      new THREE.Color(0x000000),
      0
    );

    gl.setClearAlpha(0);

    /*
     * Renderer configuration.
     */
    gl.autoClear = true;

    gl.outputColorSpace =
      THREE.SRGBColorSpace;

    gl.toneMapping =
      THREE.ACESFilmicToneMapping;

    gl.toneMappingExposure = 1;
  }, [gl, scene]);

  return null;
}

/* =========================================================
   FLOW PARTICLE
========================================================= */

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
  const ref =
    useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const elapsed =
      clock.getElapsedTime();

    const t =
      (elapsed * speed + offset) % 1;

    ref.current.position.lerpVectors(
      from,
      to,
      t
    );

    const pulse =
      Math.sin(t * Math.PI);

    ref.current.scale.setScalar(
      0.55 + pulse * 0.75
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[0.035, 10, 10]}
      />

      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.92}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* =========================================================
   INDIVIDUAL TECHNOLOGY NODE
========================================================= */

function SkillNode({
  node,
  index,
}: {
  node: NodeDef;
  index: number;
}) {
  const meshRef =
    useRef<THREE.Mesh>(null);

  const ringRef =
    useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time =
      clock.getElapsedTime();

    /*
     * Small breathing effect.
     */
    if (meshRef.current) {
      const scale =
        1 +
        Math.sin(
          time * 1.15 +
            index * 0.7
        ) *
          0.06;

      meshRef.current.scale.setScalar(
        scale
      );
    }

    /*
     * Outer pulse.
     */
    if (ringRef.current) {
      const pulse =
        Math.sin(
          time * 0.8 +
            index
        );

      const scale =
        1.6 +
        (pulse + 1) * 0.18;

      ringRef.current.scale.setScalar(
        scale
      );

      const material =
        ringRef.current
          .material as THREE.MeshBasicMaterial;

      material.opacity =
        0.045 +
        (pulse + 1) * 0.02;
    }
  });

  return (
    <group position={node.position}>
      {/* =====================================
          OUTER PULSE
      ====================================== */}

      <mesh ref={ringRef}>
        <sphereGeometry
          args={[
            node.size,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </mesh>

      {/* =====================================
          MAIN NODE
      ====================================== */}

      <mesh ref={meshRef}>
        <sphereGeometry
          args={[
            node.size,
            28,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#F5F5F5"
          emissive="#FFFFFF"
          emissiveIntensity={0.32}
          roughness={0.35}
          metalness={0.08}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* =====================================
          NODE LABEL
      ====================================== */}

      <Html
        position={[
          0,
          node.size + 0.22,
          0,
        ]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--font-jetbrains), monospace",

            fontSize: "10px",

            letterSpacing:
              "0.05em",

            color: "#FFFFFF",

            /*
             * Semi-transparent so it does not
             * completely hide ScrollCharacter.
             */
            background:
              "rgba(0,0,0,0.48)",

            border:
              "1px solid rgba(255,255,255,0.12)",

            borderRadius:
              "999px",

            padding:
              "3px 7px",

            whiteSpace:
              "nowrap",

            backdropFilter:
              "blur(6px)",

            WebkitBackdropFilter:
              "blur(6px)",
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

/* =========================================================
   CENTRAL NETWORK CORE
========================================================= */

function NetworkCore() {
  const outerRef =
    useRef<THREE.Mesh>(null);

  const innerRef =
    useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t =
      clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.x =
        t * 0.08;

      outerRef.current.rotation.y =
        t * 0.12;
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(
        1 +
          Math.sin(
            t * 1.4
          ) *
            0.04
      );
    }
  });

  return (
    <group
      position={[
        0,
        0.35,
        -1.55,
      ]}
    >
      {/* OUTER CORE */}

      <mesh ref={outerRef}>
        <icosahedronGeometry
          args={[0.38, 1]}
        />

        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* INNER CORE */}

      <mesh ref={innerRef}>
        <sphereGeometry
          args={[0.09, 20, 20]}
        />

        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.95}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   NETWORK SCENE
========================================================= */

function Scene() {
  const networkRef =
    useRef<THREE.Group>(null);

  /*
   * Pre-calculate edge vectors.
   */
  const edgeVectors =
    useMemo(
      () =>
        EDGES.map(
          ([a, b]) => {
            const start =
              nodeById(a);

            const end =
              nodeById(b);

            return {
              id: `${a}-${b}`,

              from:
                new THREE.Vector3(
                  ...start.position
                ),

              to:
                new THREE.Vector3(
                  ...end.position
                ),
            };
          }
        ),
      []
    );

  useFrame(
    ({ clock }, delta) => {
      if (!networkRef.current) {
        return;
      }

      const time =
        clock.getElapsedTime();

      /*
       * Slow rotation.
       */
      networkRef.current.rotation.y +=
        delta * 0.08;

      /*
       * Tiny sway.
       */
      networkRef.current.rotation.z =
        Math.sin(
          time * 0.16
        ) * 0.018;

      /*
       * Vertical floating.
       */
      networkRef.current.position.y =
        Math.sin(
          time * 0.35
        ) * 0.055;
    }
  );

  return (
    <>
      {/* =====================================
          TRANSPARENT SCENE
      ====================================== */}

      <TransparentCanvasSetup />

      {/* =====================================
          LIGHTS
      ====================================== */}

      <ambientLight
        intensity={0.65}
      />

      <pointLight
        position={[
          4,
          4,
          5,
        ]}
        intensity={32}
        color="#FFFFFF"
      />

      <pointLight
        position={[
          -4,
          -2,
          3,
        ]}
        intensity={18}
        color="#FFFFFF"
      />

      <pointLight
        position={[
          0,
          0,
          -4,
        ]}
        intensity={12}
        color="#FFFFFF"
      />

      {/* =====================================
          COMPLETE NETWORK
      ====================================== */}

      <group
        ref={networkRef}
        scale={0.68}
      >
        {/* LARGE BACKGROUND WIREFRAME */}

        <mesh>
          <icosahedronGeometry
            args={[3, 2]}
          />

          <meshBasicMaterial
            color="#FFFFFF"
            wireframe
            transparent
            opacity={0.022}
            depthWrite={false}
          />
        </mesh>

        {/* =====================================
            NETWORK EDGES
        ====================================== */}

        {EDGES.map(
          ([a, b]) => {
            const start =
              nodeById(a);

            const end =
              nodeById(b);

            return (
              <Line
                key={`${a}-${b}`}
                points={[
                  start.position,
                  end.position,
                ]}
                color="#FFFFFF"
                lineWidth={0.8}
                transparent
                opacity={0.2}
                depthWrite={false}
              />
            );
          }
        )}

        {/* =====================================
            PARTICLES
        ====================================== */}

        {edgeVectors.map(
          (edge, index) => (
            <FlowParticle
              key={edge.id}
              from={edge.from}
              to={edge.to}
              speed={
                0.12 +
                (index % 4) *
                  0.025
              }
              offset={
                index /
                edgeVectors.length
              }
            />
          )
        )}

        {/* =====================================
            TECHNOLOGY NODES
        ====================================== */}

        {NODES.map(
          (node, index) => (
            <SkillNode
              key={node.id}
              node={node}
              index={index}
            />
          )
        )}

        {/* CENTRAL CORE */}

        <NetworkCore />
      </group>
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function StackNetwork() {
  return (
    <div
      className="
        absolute
        inset-0

        h-full
        w-full

        pointer-events-none

        bg-transparent
      "
      style={{
        background:
          "transparent",
      }}
      aria-label="Technology network"
    >
      <Canvas
        camera={{
          position: [
            0,
            0,
            9.2,
          ],
          fov: 38,
          near: 0.1,
          far: 50,
        }}

        dpr={[1, 1.6]}

        gl={{
          /*
           * REQUIRED for transparent canvas.
           */
          alpha: true,

          antialias: true,

          powerPreference:
            "high-performance",

          premultipliedAlpha:
            true,
        }}

        /*
         * Canvas element itself must
         * also stay transparent.
         */
        style={{
          width: "100%",
          height: "100%",

          background:
            "transparent",

          backgroundColor:
            "transparent",

          pointerEvents:
            "none",
        }}

        onCreated={({
          gl,
          scene,
        }) => {
          /*
           * Remove Three.js scene background.
           */
          scene.background = null;

          /*
           * Transparent WebGL clear.
           */
          gl.setClearColor(
            new THREE.Color(
              0x000000
            ),
            0
          );

          gl.setClearAlpha(0);

          /*
           * Rendering.
           */
          gl.outputColorSpace =
            THREE.SRGBColorSpace;
          gl.toneMapping =
            THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure =
            1;
          gl.autoClear = true;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
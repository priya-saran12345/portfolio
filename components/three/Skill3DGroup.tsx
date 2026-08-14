"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import {
  Canvas,
  type ThreeEvent,
  useFrame,
} from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";

type Skill3DGroupProps = {
  items: string[];
};

type SkillWordProps = {
  text: string;
  position: [number, number, number];
  index: number;
};

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

/**
 * One interactive Three.js skill.
 *
 * Drag horizontally to rotate around the Y axis.
 * Rotation is intentionally NOT clamped, so the user
 * can rotate 360°, 720°, 1080° and beyond.
 */
function SkillWord({
  text,
  position,
  index,
}: SkillWordProps) {
  const groupRef = useRef<THREE.Group>(null);

  const targetRotation = useRef(0);
  const targetRotationOnPointerDown = useRef(0);
  const pointerXOnPointerDown = useRef(0);

  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const textSize = useMemo(() => {
    const scale = Math.max(
      0.46,
      Math.min(1.1, 11.5 / text.length)
    );

    return 0.7 * scale;
  }, [text]);

  useFrame((state) => {
    const group = groupRef.current;

    if (!group) return;

    // Smooth rotation exactly like the Three.js demo:
    // group.rotation.y +=
    //   (targetRotation - group.rotation.y) * 0.05;

    group.rotation.y +=
      (targetRotation.current - group.rotation.y) *
      (dragging ? 0.12 : 0.075);

    // Small floating animation
    group.position.y =
      position[1] +
      Math.sin(
        state.clock.elapsedTime * 1.15 +
          index * 0.75
      ) *
        0.025;

    // Slight scale effect while hovering/dragging
    const desiredScale = dragging
      ? 1.08
      : hovered
        ? 1.045
        : 1;

    const nextScale = THREE.MathUtils.lerp(
      group.scale.x,
      desiredScale,
      0.1
    );

    group.scale.setScalar(nextScale);
  });

  const startSpin = (
    event: ThreeEvent<PointerEvent>
  ) => {
    event.stopPropagation();

    setDragging(true);
    setHovered(true);

    pointerXOnPointerDown.current =
      event.clientX;

    targetRotationOnPointerDown.current =
      targetRotation.current;

    /*
     * ThreeEvent.target is typed as EventTarget.
     * Pointer capture methods belong to Element,
     * so we safely narrow/cast it here.
     */
    const target =
      event.target as Element;

    if (
      typeof target.setPointerCapture ===
      "function"
    ) {
      target.setPointerCapture(
        event.pointerId
      );
    }

    document.body.style.cursor =
      "grabbing";
  };

  const spin = (
    event: ThreeEvent<PointerEvent>
  ) => {
    if (!dragging) return;

    event.stopPropagation();

    const pointerX = event.clientX;

    /*
     * This is the same logic used by the
     * official Three.js geometry text demo.
     *
     * No clamp = unlimited horizontal spin.
     */
    targetRotation.current =
      targetRotationOnPointerDown.current +
      (pointerX -
        pointerXOnPointerDown.current) *
        0.02;
  };

  const stopSpin = (
    event: ThreeEvent<PointerEvent>
  ) => {
    event.stopPropagation();

    setDragging(false);

    /*
     * Correct TypeScript-safe pointer release.
     */
    const target =
      event.target as Element;

    if (
      typeof target.hasPointerCapture ===
        "function" &&
      target.hasPointerCapture(
        event.pointerId
      )
    ) {
      target.releasePointerCapture(
        event.pointerId
      );
    }

    document.body.style.cursor =
      hovered ? "grab" : "default";
  };

  return (
    <group
      ref={groupRef}
      position={position}
    >
      {/* =========================
          MAIN 3D SKILL TEXT
      ========================== */}
      <Center>
        <Text3D
          font={FONT_URL}
          size={textSize}
          height={0.28}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.035}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={4}
          onPointerDown={startSpin}
          onPointerMove={spin}
          onPointerUp={stopSpin}
          onPointerCancel={stopSpin}
          onPointerOver={(event) => {
            event.stopPropagation();

            setHovered(true);

            if (!dragging) {
              document.body.style.cursor =
                "grab";
            }
          }}
          onPointerOut={() => {
            if (!dragging) {
              setHovered(false);
              document.body.style.cursor =
                "default";
            }
          }}
        >
          {text}

          {/* Front face */}
          <meshPhongMaterial
            attach="material-0"
            color="#2dd4bf"
            shininess={90}
            specular="#b8fff5"
            flatShading
          />

          {/* Darker extruded side */}
          <meshPhongMaterial
            attach="material-1"
            color="#083b36"
            shininess={30}
            specular="#2dd4bf"
          />
        </Text3D>
      </Center>

      {/* =========================
          MIRRORED REFLECTION
      ========================== */}
      <group
        position={[0, -0.74, 0.05]}
        scale={[1, -1, 1]}
      >
        <Center>
          <Text3D
            font={FONT_URL}
            size={textSize}
            height={0.18}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.022}
            bevelSize={0.014}
            bevelSegments={3}
          >
            {text}

            <meshPhongMaterial
              attach="material-0"
              color="#5eead4"
              transparent
              opacity={0.17}
              shininess={50}
              depthWrite={false}
            />

            <meshPhongMaterial
              attach="material-1"
              color="#0f514a"
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </Text3D>
        </Center>
      </group>

      {/* =========================
          TEAL GLOW
      ========================== */}
      <mesh
        position={[
          0,
          -0.82,
          -0.42,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[4.8, 1]}
        />

        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={
            dragging
              ? 0.075
              : hovered
                ? 0.05
                : 0.018
          }
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Scene containing all skills in one group/card.
 */
function SkillScene({
  items,
}: Skill3DGroupProps) {
  const columns =
    items.length === 1 ? 1 : 2;

  const rows = Math.ceil(
    items.length / columns
  );

  const positions = useMemo(() => {
    const xGap = 2.75;

    const rowGap =
      rows >= 5
        ? 1.48
        : rows === 4
          ? 1.62
          : 1.82;

    const totalHeight =
      (rows - 1) * rowGap;

    return items.map(
      (_, index) => {
        const column =
          index % columns;

        const row = Math.floor(
          index / columns
        );

        const x =
          columns === 1
            ? 0
            : column === 0
              ? -xGap
              : xGap;

        const y =
          totalHeight / 2 -
          row * rowGap;

        return [
          x,
          y,
          0,
        ] as [
          number,
          number,
          number,
        ];
      }
    );
  }, [items, columns, rows]);

  return (
    <>
      {/* Background */}
      <color
        attach="background"
        args={["#050607"]}
      />

      <fog
        attach="fog"
        args={[
          "#050607",
          9,
          20,
        ]}
      />

      {/* =========================
          LIGHTING
      ========================== */}
      <ambientLight
        intensity={0.3}
      />

      <directionalLight
        position={[0, 1, 7]}
        intensity={1.7}
        color="#ffffff"
      />

      <directionalLight
        position={[-6, 4, 4]}
        intensity={1.1}
        color="#2dd4bf"
      />

      <pointLight
        position={[1, 2, 5]}
        intensity={16}
        distance={15}
        decay={2}
        color="#14b8a6"
      />

      <pointLight
        position={[-4, -1, 3]}
        intensity={7}
        distance={11}
        decay={2}
        color="#ffffff"
      />

      {/* =========================
          SKILLS
      ========================== */}
      {items.map(
        (item, index) => (
          <SkillWord
            key={item}
            text={item}
            position={
              positions[index]
            }
            index={index}
          />
        )
      )}

      {/* =========================
          FLOOR
      ========================== */}
      <mesh
        position={[
          0,
          -4.05,
          -0.8,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[20, 12]}
        />

        <meshPhongMaterial
          color="#151719"
          shininess={18}
          specular="#2a2d31"
        />
      </mesh>
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry
        args={[
          0.2,
          0.2,
          0.2,
        ]}
      />

      <meshStandardMaterial
        color="#2dd4bf"
      />
    </mesh>
  );
}

export default function Skill3DGroup({
  items,
}: Skill3DGroupProps) {
  const rows = Math.ceil(
    items.length / 2
  );

  const height =
    rows <= 2
      ? 300
      : rows === 3
        ? 370
        : rows === 4
          ? 430
          : 500;

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-[#050607]
      "
      style={{
        height,
        touchAction: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{
          position: [
            0,
            0.4,
            11.5,
          ],
          fov: 36,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
      >
        <Suspense
          fallback={
            <LoadingFallback />
          }
        >
          <SkillScene
            items={items}
          />
        </Suspense>
      </Canvas>

      {/* Instruction */}
      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-3
          rounded-full
          border
          border-teal/20
          bg-black/30
          px-2.5
          py-1
          font-mono
          text-[9px]
          uppercase
          tracking-[0.14em]
          text-teal/65
          backdrop-blur-sm
        "
      >
        drag skill to spin 360°
      </div>

      {/* Top highlight */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-20
          bg-gradient-to-b
          from-white/[0.035]
          to-transparent
        "
      />

      {/* Reflection fade */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-24
          bg-gradient-to-t
          from-[#050607]
          via-[#050607]/55
          to-transparent
        "
      />
    </div>
  );
}

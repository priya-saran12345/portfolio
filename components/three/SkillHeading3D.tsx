"use client";

import {
  Suspense,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  type ThreeEvent,
  useFrame,
} from "@react-three/fiber";
import {
  Center,
  Text3D,
} from "@react-three/drei";
import * as THREE from "three";

type SkillHeading3DProps = {
  text?: string;
};

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

function HeadingMesh({
  text,
}: {
  text: string;
}) {
  const groupRef =
    useRef<THREE.Group>(null);

  const targetRotation =
    useRef(0);

  const targetRotationOnPointerDown =
    useRef(0);

  const pointerXOnPointerDown =
    useRef(0);

  const [dragging, setDragging] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) return;

    /*
      Smooth drag-to-spin movement.
      Rotation is not clamped, so the
      heading can rotate 360°, 720°, etc.
    */
    group.rotation.y +=
      (targetRotation.current -
        group.rotation.y) *
      (dragging ? 0.13 : 0.075);

    const targetScale =
      dragging
        ? 1.06
        : hovered
          ? 1.025
          : 1;

    const nextScale =
      THREE.MathUtils.lerp(
        group.scale.x,
        targetScale,
        0.1
      );

    group.scale.setScalar(nextScale);
  });

  const onPointerDown = (
    event: ThreeEvent<PointerEvent>
  ) => {
    event.stopPropagation();

    setDragging(true);
    setHovered(true);

    pointerXOnPointerDown.current =
      event.clientX;

    targetRotationOnPointerDown.current =
      targetRotation.current;

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

  const onPointerMove = (
    event: ThreeEvent<PointerEvent>
  ) => {
    if (!dragging) return;

    event.stopPropagation();

    targetRotation.current =
      targetRotationOnPointerDown.current +
      (event.clientX -
        pointerXOnPointerDown.current) *
        0.02;
  };

  const onPointerUp = (
    event: ThreeEvent<PointerEvent>
  ) => {
    event.stopPropagation();

    setDragging(false);

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
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={0.92}
          height={0.28}
          curveSegments={10}
          bevelEnabled
          bevelThickness={0.045}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={5}
          onPointerDown={
            onPointerDown
          }
          onPointerMove={
            onPointerMove
          }
          onPointerUp={
            onPointerUp
          }
          onPointerCancel={
            onPointerUp
          }
          onPointerOver={(
            event
          ) => {
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

          {/* Bright teal front */}
          <meshPhongMaterial
            attach="material-0"
            color="#2dd4bf"
            shininess={110}
            specular="#d8fff9"
            flatShading
          />

          {/* Dark teal side extrusion */}
          <meshPhongMaterial
            attach="material-1"
            color="#063b36"
            shininess={38}
            specular="#2dd4bf"
          />
        </Text3D>
      </Center>
    </group>
  );
}

function HeadingScene({
  text,
}: {
  text: string;
}) {
  return (
    <>
      {/* Transparent background */}
      <ambientLight
        intensity={0.42}
      />

      <directionalLight
        position={[0, 2, 5]}
        intensity={1.8}
        color="#ffffff"
      />

      <directionalLight
        position={[-3, 1, 4]}
        intensity={1.15}
        color="#2dd4bf"
      />

      <pointLight
        position={[2, 0, 4]}
        intensity={7}
        distance={10}
        color="#14b8a6"
      />

      <HeadingMesh text={text} />
    </>
  );
}

export default function SkillHeading3D({
  text = "Skills",
}: SkillHeading3DProps) {
  return (
    <div
      className="
        relative
        h-full
        w-full
        cursor-grab
        active:cursor-grabbing
      "
      style={{
        touchAction: "none",
      }}
      title="Drag horizontally to rotate"
      aria-label={text}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 4.8],
          fov: 30,
          near: 0.1,
          far: 30,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(
            0x000000,
            0
          );
        }}
      >
        <Suspense fallback={null}>
          <HeadingScene
            text={text}
          />
        </Suspense>
      </Canvas>

      {/* Screen-reader text */}
      <span className="sr-only">
        {text}
      </span>
    </div>
  );
}

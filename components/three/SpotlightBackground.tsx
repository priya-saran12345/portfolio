"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

const DISTURB_TEXTURE =
  "https://threejs.org/examples/textures/disturb.jpg";

const LUCY_MODEL =
  "https://threejs.org/examples/models/ply/binary/Lucy100k.ply";

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // The official example's OrbitControls targets (0, 1, 0).
    camera.lookAt(new THREE.Vector3(0, 1, 0));
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function Lucy() {
  const sourceGeometry = useLoader(
    PLYLoader,
    LUCY_MODEL
  );

  const geometry = useMemo(() => {
    const cloned = sourceGeometry.clone();

    cloned.scale(
      0.0024,
      0.0024,
      0.0024
    );

    cloned.computeVertexNormals();

    return cloned;
  }, [sourceGeometry]);

  return (
    <mesh
      geometry={geometry}
      rotation={[0, -Math.PI / 2, 0]}
      position={[0, 0.8, 0]}
      castShadow
      receiveShadow
    >
      <meshLambertMaterial color="#d7d7d7" />
    </mesh>
  );
}

function MovingSpotlight() {
  const lightRef =
    useRef<THREE.SpotLight>(null);

  const disturbTexture =
    useTexture(DISTURB_TEXTURE);

  useEffect(() => {
    disturbTexture.minFilter =
      THREE.LinearFilter;

    disturbTexture.magFilter =
      THREE.LinearFilter;

    disturbTexture.generateMipmaps =
      false;

    disturbTexture.colorSpace =
      THREE.SRGBColorSpace;

    disturbTexture.needsUpdate = true;
  }, [disturbTexture]);

  useFrame(({ clock }) => {
    const light = lightRef.current;

    if (!light) return;

    /*
     * Same circular movement as the official example:
     *
     * time = performance.now() / 3000
     * x = cos(time) * 2.5
     * z = sin(time) * 2.5
     */
    const time =
      clock.elapsedTime / 3;

    light.position.x =
      Math.cos(time) * 2.5;

    light.position.z =
      Math.sin(time) * 2.5;
  });

  return (
    <spotLight
      ref={lightRef}
      color="#ffffff"
      intensity={100}
      position={[2.5, 5, 2.5]}
      angle={Math.PI / 6}
      penumbra={1}
      decay={2}
      distance={0}
      castShadow
      map={disturbTexture}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={2}
      shadow-camera-far={10}
      shadow-focus={1}
      shadow-bias={-0.003}
    />
  );
}

function SpotlightScene() {
  return (
    <>
      <CameraSetup />

      <color
        attach="background"
        args={["#090d12"]}
      />

      {/* Same hemisphere light values as the Three.js example */}
      <hemisphereLight
        args={[
          "#ffffff",
          "#8d8d8d",
          0.25,
        ]}
      />

      <MovingSpotlight />

      {/* Shadow-receiving floor from the official example */}
      <mesh
        position={[0, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshLambertMaterial color="#bcbcbc" />
      </mesh>

      {/* Lucy PLY model from the official example */}
      <Lucy />
    </>
  );
}

export default function SpotlightBackground() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
      aria-hidden="true"
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [7, 4, 1],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
        onCreated={({ gl }) => {
gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;

          gl.shadowMap.enabled = true;

          gl.shadowMap.type =
            THREE.PCFShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <SpotlightScene />
        </Suspense>
      </Canvas>

      {/* Dark overlay so your portfolio content remains readable */}
      <div
        className="
          absolute
          inset-0
          bg-base/55
        "
      />

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-base
          via-base/60
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-44
          bg-gradient-to-t
          from-base
          via-base/75
          to-transparent
        "
      />
    </div>
  );
}

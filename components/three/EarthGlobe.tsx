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
} from "@react-three/fiber";

import {
  OrbitControls,
  useTexture,
} from "@react-three/drei";

import * as THREE from "three";

import DAY from "@/public/texture/earth/earth_day_4096.jpg";
import NIGHT from "@/public/texture/earth/earth_night_4096.jpg";
import PACKED from "@/public/texture/earth/earth_bump_roughness_clouds_4096.jpg";

/* =========================================================
   EARTH VERTEX SHADER
========================================================= */

const earthVertex = `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  vec4 worldPosition =
    modelMatrix * vec4(position, 1.0);

  vWorldPosition =
    worldPosition.xyz;

  vWorldNormal =
    normalize(
      mat3(modelMatrix) * normal
    );

  gl_Position =
    projectionMatrix *
    viewMatrix *
    worldPosition;
}
`;

/* =========================================================
   EARTH FRAGMENT SHADER
========================================================= */

const earthFragment = `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D packedMap;

uniform vec3 sunDirection;

uniform vec3 atmosphereDayColor;
uniform vec3 atmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {

  vec3 normal =
    normalize(vWorldNormal);

  vec3 viewDirection =
    normalize(
      cameraPosition -
      vWorldPosition
    );

  /* -----------------------------------------
     SUN DIRECTION
  ----------------------------------------- */

  float sunOrientation =
    dot(
      normal,
      normalize(sunDirection)
    );

  /* -----------------------------------------
     TEXTURES
  ----------------------------------------- */

  vec3 dayColor =
    texture2D(
      dayMap,
      vUv
    ).rgb;

  vec3 nightColor =
    texture2D(
      nightMap,
      vUv
    ).rgb;

  vec3 packed =
    texture2D(
      packedMap,
      vUv
    ).rgb;

  /* -----------------------------------------
     CLOUDS
  ----------------------------------------- */

  float clouds =
    smoothstep(
      0.2,
      1.0,
      packed.b
    );

  dayColor =
    mix(
      dayColor,
      vec3(1.0),
      clouds * 0.60
    );

  /* -----------------------------------------
     DAY / NIGHT TRANSITION
  ----------------------------------------- */

  float dayStrength =
    smoothstep(
      -0.25,
      0.5,
      sunOrientation
    );

  vec3 finalColor =
    mix(
      nightColor * 1.35,
      dayColor,
      dayStrength
    );

  /* -----------------------------------------
     FRESNEL
  ----------------------------------------- */

  float fresnel =
    1.0 -
    abs(
      dot(
        viewDirection,
        normal
      )
    );

  fresnel =
    pow(
      clamp(
        fresnel,
        0.0,
        1.0
      ),
      2.0
    );

  /* -----------------------------------------
     ATMOSPHERE COLOR
  ----------------------------------------- */

  vec3 atmosphereColor =
    mix(
      atmosphereTwilightColor,
      atmosphereDayColor,

      smoothstep(
        -0.25,
        0.75,
        sunOrientation
      )
    );

  float atmosphereMix =
    smoothstep(
      -0.5,
      1.0,
      sunOrientation
    )
    *
    fresnel
    *
    0.65;

  finalColor =
    mix(
      finalColor,
      atmosphereColor,

      clamp(
        atmosphereMix,
        0.0,
        1.0
      )
    );

  gl_FragColor =
    vec4(
      finalColor,
      1.0
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/* =========================================================
   ATMOSPHERE VERTEX
========================================================= */

const atmosphereVertex = `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {

  vec4 worldPosition =
    modelMatrix *
    vec4(
      position,
      1.0
    );

  vWorldPosition =
    worldPosition.xyz;

  vWorldNormal =
    normalize(
      mat3(modelMatrix) *
      normal
    );

  gl_Position =
    projectionMatrix *
    viewMatrix *
    worldPosition;
}
`;

/* =========================================================
   ATMOSPHERE FRAGMENT
========================================================= */

const atmosphereFragment = `
uniform vec3 sunDirection;

uniform vec3 atmosphereDayColor;
uniform vec3 atmosphereTwilightColor;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {

  vec3 normal =
    normalize(vWorldNormal);

  vec3 viewDirection =
    normalize(
      cameraPosition -
      vWorldPosition
    );

  /* -----------------------------------------
     FRESNEL
  ----------------------------------------- */

  float fresnel =
    1.0 -
    abs(
      dot(
        viewDirection,
        normal
      )
    );

  /* -----------------------------------------
     SUN
  ----------------------------------------- */

  float sunOrientation =
    dot(
      normal,
      normalize(sunDirection)
    );

  /* -----------------------------------------
     BLUE / ORANGE ATMOSPHERE
  ----------------------------------------- */

  vec3 atmosphereColor =
    mix(
      atmosphereTwilightColor,
      atmosphereDayColor,

      smoothstep(
        -0.25,
        0.75,
        sunOrientation
      )
    );

  /* -----------------------------------------
     EDGE GLOW
  ----------------------------------------- */

  float alpha =
    pow(
      smoothstep(
        0.2,
        1.0,
        fresnel
      ),
      2.3
    );

  alpha *=
    smoothstep(
      -0.5,
      1.0,
      sunOrientation
    );

  gl_FragColor =
    vec4(
      atmosphereColor,
      alpha * 0.95
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/* =========================================================
   EARTH
========================================================= */

function Earth() {
  const group =
    useRef<THREE.Group>(null);

  /* -------------------------------------------------------
     IMPORTANT:
     Imported Next.js images become StaticImageData.

     useTexture needs URL strings,
     therefore we use .src
  ------------------------------------------------------- */

  const [
    day,
    night,
    packed,
  ] = useTexture([
    DAY.src,
    NIGHT.src,
    PACKED.src,
  ]);

  /* -------------------------------------------------------
     TEXTURE SETTINGS
  ------------------------------------------------------- */

  useEffect(() => {
    day.colorSpace =
      THREE.SRGBColorSpace;

    night.colorSpace =
      THREE.SRGBColorSpace;

    day.anisotropy = 8;
    night.anisotropy = 8;
    packed.anisotropy = 8;

    day.needsUpdate = true;
    night.needsUpdate = true;
    packed.needsUpdate = true;
  }, [
    day,
    night,
    packed,
  ]);

  /* -------------------------------------------------------
     SUN DIRECTION
  ------------------------------------------------------- */

  const sunDirection =
    useMemo(
      () =>
        new THREE.Vector3(
          0.25,
          0.08,
          1
        ).normalize(),
      []
    );

  /* -------------------------------------------------------
     EARTH UNIFORMS
  ------------------------------------------------------- */

  const earthUniforms =
    useMemo(
      () => ({
        dayMap: {
          value: day,
        },

        nightMap: {
          value: night,
        },

        packedMap: {
          value: packed,
        },

        sunDirection: {
          value:
            sunDirection,
        },

        atmosphereDayColor: {
          value:
            new THREE.Color(
              "#4db2ff"
            ),
        },

        atmosphereTwilightColor: {
          value:
            new THREE.Color(
              "#bc490b"
            ),
        },
      }),
      [
        day,
        night,
        packed,
        sunDirection,
      ]
    );

  /* -------------------------------------------------------
     ATMOSPHERE UNIFORMS
  ------------------------------------------------------- */

  const atmosphereUniforms =
    useMemo(
      () => ({
        sunDirection: {
          value:
            sunDirection,
        },

        atmosphereDayColor: {
          value:
            new THREE.Color(
              "#4db2ff"
            ),
        },

        atmosphereTwilightColor: {
          value:
            new THREE.Color(
              "#bc490b"
            ),
        },
      }),
      [sunDirection]
    );

  /* -------------------------------------------------------
     AUTOMATIC ROTATION

     OrbitControls rotates the camera.
     This continues rotating the Earth slowly.
  ------------------------------------------------------- */

  useFrame((_, delta) => {
    if (!group.current)
      return;

    group.current.rotation.y +=
      delta * 0.025;
  });

  return (
    <group ref={group}>

      {/* =====================================
          EARTH
      ====================================== */}

      <mesh>
        <sphereGeometry
          args={[
            1,
            96,
            96,
          ]}
        />

        <shaderMaterial
          vertexShader={
            earthVertex
          }
          fragmentShader={
            earthFragment
          }
          uniforms={
            earthUniforms
          }
        />
      </mesh>

      {/* =====================================
          ATMOSPHERE
      ====================================== */}

      <mesh
        scale={1.04}
      >
        <sphereGeometry
          args={[
            1,
            96,
            96,
          ]}
        />

        <shaderMaterial
          vertexShader={
            atmosphereVertex
          }
          fragmentShader={
            atmosphereFragment
          }
          uniforms={
            atmosphereUniforms
          }
          side={
            THREE.BackSide
          }
          transparent
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </mesh>

    </group>
  );
}

/* =========================================================
   LOADING EARTH
========================================================= */

function LoadingEarth() {
  return (
    <mesh>
      <sphereGeometry
        args={[
          1,
          32,
          32,
        ]}
      />

      <meshBasicMaterial
        color="#164e63"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function EarthGlobe() {
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
    >
      <Canvas
        dpr={[
          1,
          1.5,
        ]}
        camera={{
          position: [
            4.5,
            2,
            3,
          ],
          fov: 25,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,

          powerPreference:
            "high-performance",
        }}
        onCreated={({
          gl,
          camera,
        }) => {

          /* Transparent background */

          gl.setClearColor(
            0x000000,
            0
          );

          /* Correct colors */

          gl.outputColorSpace =
            THREE.SRGBColorSpace;

          /* Tone mapping */

          gl.toneMapping =
            THREE.ACESFilmicToneMapping;

          gl.toneMappingExposure =
            1.05;

          /* Point camera to Earth */

          camera.lookAt(
            0,
            0,
            0
          );
        }}
      >

        {/* ===================================
            EARTH
        ==================================== */}

        <Suspense
          fallback={
            <LoadingEarth />
          }
        >
          <Earth />
        </Suspense>

        {/* ===================================
            MOUSE CONTROLS

            Left drag  = rotate
            Wheel      = zoom
            Right drag = disabled
        ==================================== */}

        <OrbitControls
          makeDefault

          /* Smooth movement */
          enableDamping
          dampingFactor={
            0.055
          }

          /* Rotation */
          enableRotate
          rotateSpeed={
            0.55
          }

          /* Zoom */
          enableZoom
          zoomSpeed={
            0.65
          }

          /* No camera panning */
          enablePan={
            false
          }

          /* Zoom limits */
          minDistance={
            2.2
          }

          maxDistance={
            9
          }

          /* Globe center */
          target={[
            0,
            0,
            0,
          ]}

          /* Prevent flipping */
          minPolarAngle={
            0.15
          }

          maxPolarAngle={
            Math.PI -
            0.15
          }
        />

      </Canvas>
    </div>
  );
}

/* =========================================================
   PRELOAD TEXTURES
========================================================= */

useTexture.preload([
  DAY.src,
  NIGHT.src,
  PACKED.src,
]);
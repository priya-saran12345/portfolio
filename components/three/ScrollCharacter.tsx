"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Same Soldier used by the official Three.js skeletal-animation example.
 * You can later replace this URL with your own /public model without
 * changing the scroll/animation logic.
 */
const MODEL_URL =
  process.env.NEXT_PUBLIC_SOLDIER_MODEL_URL ||
  "https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/models/gltf/Soldier.glb";

// These IDs match the sections already present in your portfolio.
const SECTION_IDS = [
  "top",
  "skills",
  "services",
  "experience",
  "projects",
  "contact",
] as const;

/**
 * x/y are percentages of the visible Three.js viewport.
 * Alternate left/right so the character travels around the content
 * rather than permanently covering one side.
 */
const WAYPOINTS = [
  { x: 0.32, y: -0.17, scale: 1.14 }, // top
  { x: -0.34, y: -0.18, scale: 1.05 }, // skills
  { x: 0.34, y: -0.18, scale: 1.07 }, // services
  { x: -0.33, y: -0.18, scale: 1.04 }, // experience
  { x: 0.34, y: -0.18, scale: 1.07 }, // projects
  { x: -0.32, y: -0.18, scale: 1.05 }, // contact
] as const;

type FlightState = {
  active: boolean;
  startedAt: number;
  duration: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  targetIndex: number;
  direction: 1 | -1;
};

function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getActiveSectionIndex() {
  if (typeof window === "undefined") return 0;

  const viewportCenter = window.innerHeight * 0.5;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  SECTION_IDS.forEach((id, index) => {
    const section = document.getElementById(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function SoldierModel() {
  const root = useRef<THREE.Group>(null);
  const animatedModel = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const gltf = useGLTF(MODEL_URL);
  const { actions } = useAnimations(gltf.animations, animatedModel);

  const motion = useRef({
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    smoothVelocity: 0,
    lastScrollAt: 0,
    activeIndex: 0,
    targetIndex: 0,
    reducedMotion: false,
  });

  const flight = useRef<FlightState>({
    active: false,
    startedAt: 0,
    duration: 950,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    targetIndex: 0,
    direction: 1,
  });

  const animation = useRef<{
    idle?: THREE.AnimationAction;
    walk?: THREE.AnimationAction;
    run?: THREE.AnimationAction;
  }>({});

  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  // Keep the animated skinned meshes stable while they move around a fixed canvas.
  useEffect(() => {
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.frustumCulled = false;
      }
    });
  }, [gltf.scene]);

  // Soldier.glb contains Idle, Run and Walk clips.
  // We find them by name first and retain index fallbacks for this exact model.
  useEffect(() => {
    if (!gltf.animations.length) return;

    const idleClip =
      gltf.animations.find((clip) => clip.name.toLowerCase().includes("idle")) ||
      gltf.animations[0];

    const runClip =
      gltf.animations.find((clip) => clip.name.toLowerCase().includes("run")) ||
      gltf.animations[1] ||
      gltf.animations[0];

    const walkClip =
      gltf.animations.find((clip) => clip.name.toLowerCase().includes("walk")) ||
      gltf.animations[3] ||
      gltf.animations[0];

    const idle = actions[idleClip.name] || undefined;
    const walk = actions[walkClip.name] || undefined;
    const run = actions[runClip.name] || undefined;

    animation.current = { idle, walk, run };

    [idle, walk, run].forEach((action) => {
      if (!action) return;
      action.enabled = true;
      action.setEffectiveWeight(0);
      action.play();
    });

    idle?.setEffectiveWeight(1);

    return () => {
      [idle, walk, run].forEach((action) => action?.stop());
    };
  }, [actions, gltf.animations]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const syncReducedMotion = () => {
      motion.current.reducedMotion = reducedMotionQuery.matches;
    };

    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);

    const pointFor = (index: number) => {
      const point = WAYPOINTS[index] || WAYPOINTS[0];
      return new THREE.Vector3(
        viewport.width * point.x,
        viewport.height * point.y,
        0
      );
    };

    const startFlight = (targetIndex: number, direction: 1 | -1) => {
      if (!root.current || motion.current.reducedMotion) return;

      flight.current = {
        active: true,
        startedAt: performance.now(),
        duration: 950,
        from: root.current.position.clone(),
        to: pointFor(targetIndex),
        targetIndex,
        direction,
      };

      motion.current.targetIndex = targetIndex;
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const elapsed = Math.max(now - motion.current.lastTime, 16);
      const deltaY = currentY - motion.current.lastY;
      const velocity = (deltaY / elapsed) * 1000;
      const nextSection = getActiveSectionIndex();

      motion.current.velocity = velocity;
      motion.current.lastY = currentY;
      motion.current.lastTime = now;
      motion.current.lastScrollAt = now;

      if (nextSection !== motion.current.activeIndex) {
        const oldSection = motion.current.activeIndex;
        const direction: 1 | -1 = nextSection > oldSection ? 1 : -1;

        motion.current.activeIndex = nextSection;
        motion.current.targetIndex = nextSection;

        // Slow/smooth mouse scrolling = walk.
        // A large jump/fast scroll = Superman-style rotating flight.
        const fastJump =
          Math.abs(velocity) > 2100 ||
          Math.abs(deltaY) > window.innerHeight * 0.28;

        if (fastJump) {
          startFlight(nextSection, direction);
        }
      }
    };

    // Clicking navbar/CTA anchors should use the flight transition even though
    // the browser performs a smooth section scroll underneath it.
    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const nextIndex = SECTION_IDS.indexOf(
        id as (typeof SECTION_IDS)[number]
      );
      if (nextIndex < 0) return;

      const direction: 1 | -1 =
        nextIndex >= motion.current.activeIndex ? 1 : -1;

      startFlight(nextIndex, direction);
    };

    motion.current.lastY = window.scrollY;
    motion.current.lastTime = performance.now();
    motion.current.activeIndex = getActiveSectionIndex();
    motion.current.targetIndex = motion.current.activeIndex;

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onAnchorClick, true);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncReducedMotion);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, [viewport.height, viewport.width]);

  useFrame((_, delta) => {
    if (!root.current) return;

    const now = performance.now();
    const idle = animation.current.idle;
    const walk = animation.current.walk;
    const run = animation.current.run;

    // Smooth out browser scroll event bursts so animation blending feels natural.
    motion.current.smoothVelocity = THREE.MathUtils.damp(
      motion.current.smoothVelocity,
      motion.current.velocity,
      8,
      delta
    );

    if (now - motion.current.lastScrollAt > 140) {
      motion.current.velocity = THREE.MathUtils.damp(
        motion.current.velocity,
        0,
        13,
        delta
      );
    }

    const speed = Math.abs(motion.current.smoothVelocity);
    const scrolling = speed > 24 && now - motion.current.lastScrollAt < 260;
    const running = speed > 1150;
    const flying = flight.current.active && !motion.current.reducedMotion;

    const idleWeight = flying ? 1 : scrolling ? 0.02 : 1;
    const walkWeight = flying ? 0 : scrolling && !running ? 0.98 : 0;
    const runWeight = flying ? 0 : scrolling && running ? 0.95 : 0;

    if (idle) {
      idle.setEffectiveWeight(
        THREE.MathUtils.damp(
          idle.getEffectiveWeight(),
          idleWeight,
          11,
          delta
        )
      );
    }

    if (walk) {
      walk.setEffectiveWeight(
        THREE.MathUtils.damp(
          walk.getEffectiveWeight(),
          walkWeight,
          13,
          delta
        )
      );
      walk.setEffectiveTimeScale(
        THREE.MathUtils.clamp(speed / 420, 0.7, 1.6)
      );
    }

    if (run) {
      run.setEffectiveWeight(
        THREE.MathUtils.damp(run.getEffectiveWeight(), runWeight, 13, delta)
      );
      run.setEffectiveTimeScale(
        THREE.MathUtils.clamp(speed / 1050, 0.9, 1.45)
      );
    }

    const point = WAYPOINTS[motion.current.targetIndex] || WAYPOINTS[0];
    desiredPosition.set(
      viewport.width * point.x,
      viewport.height * point.y,
      0
    );

    if (flying) {
      const currentFlight = flight.current;
      const rawProgress = THREE.MathUtils.clamp(
        (now - currentFlight.startedAt) / currentFlight.duration,
        0,
        1
      );
      const progress = easeInOutCubic(rawProgress);

      // Curved flight path rather than a straight teleport.
      const arc = Math.sin(Math.PI * rawProgress) * viewport.height * 0.28;

      root.current.position.lerpVectors(
        currentFlight.from,
        currentFlight.to,
        progress
      );
      root.current.position.y += arc;

      // Horizontal "Superman" tilt + one complete rotating spin.
      const supermanTilt = currentFlight.direction * -Math.PI * 0.5;
      const spin = currentFlight.direction * Math.PI * 2 * rawProgress;

      root.current.rotation.z = THREE.MathUtils.damp(
        root.current.rotation.z,
        supermanTilt,
        10,
        delta
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -0.28,
        9,
        delta
      );
      root.current.rotation.y = Math.PI + spin;

      const flightScale =
        point.scale * (1 + Math.sin(Math.PI * rawProgress) * 0.15);
      const nextScale = THREE.MathUtils.damp(
        root.current.scale.x,
        flightScale,
        8,
        delta
      );
      root.current.scale.setScalar(nextScale);

      if (rawProgress >= 1) {
        currentFlight.active = false;
        motion.current.activeIndex = currentFlight.targetIndex;
        motion.current.targetIndex = currentFlight.targetIndex;
      }
    } else {
      // During normal mouse scrolling the character walks smoothly from one
      // section waypoint to the next instead of flying.
      root.current.position.x = THREE.MathUtils.damp(
        root.current.position.x,
        desiredPosition.x,
        4.4,
        delta
      );
      root.current.position.y = THREE.MathUtils.damp(
        root.current.position.y,
        desiredPosition.y,
        4.4,
        delta
      );
      root.current.position.z = THREE.MathUtils.damp(
        root.current.position.z,
        0,
        6,
        delta
      );

      root.current.rotation.z = THREE.MathUtils.damp(
        root.current.rotation.z,
        0,
        8,
        delta
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        0,
        8,
        delta
      );

      // Soldier faces the camera; a tiny lean gives scroll direction feedback.
      const lean = THREE.MathUtils.clamp(
        motion.current.smoothVelocity / 2500,
        -1,
        1
      );
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        Math.PI + lean * 0.12,
        7,
        delta
      );

      const nextScale = THREE.MathUtils.damp(
        root.current.scale.x,
        point.scale,
        8,
        delta
      );
      root.current.scale.setScalar(nextScale);
    }
  });

  return (
    <group ref={root}>
      {/* Soldier origin is around the feet, so shift him down to center him. */}
      <group ref={animatedModel} position={[0, -0.9, 0]}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#10141c", 2.2]} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={3.4}
        color="#ffffff"
      />
      <directionalLight
        position={[-4, 2, 3]}
        intensity={2.1}
        color="#4EF0C4"
      />

      <Suspense fallback={null}>
        <SoldierModel />
      </Suspense>
    </>
  );
}

export default function ScrollCharacter() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.4], fov: 38, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
















// "use client";

// import { useAnimations, useGLTF } from "@react-three/drei";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Suspense, useEffect, useMemo, useRef } from "react";
// import * as THREE from "three";

// // -----------------------------------------------------
// // MODEL PATHS
// // -----------------------------------------------------

// const CHARACTER_MODEL_URL =
//   process.env.NEXT_PUBLIC_CHARACTER_MODEL_URL ||
//   "/models/relaxed-creator.glb";

// const LAPTOP_MODEL_URL =
//   process.env.NEXT_PUBLIC_LAPTOP_MODEL_URL || "/models/laptop.glb";

// // -----------------------------------------------------
// // PORTFOLIO SECTIONS
// // -----------------------------------------------------

// const SECTION_IDS = [
//   "top",
//   "skills",
//   "services",
//   "experience",
//   "projects",
//   "contact",
// ] as const;

// // -----------------------------------------------------
// // CHARACTER POSITIONS
// // -----------------------------------------------------

// const WAYPOINTS = [
//   { x: 0.32, y: -0.17, scale: 1.14 }, // top
//   { x: -0.34, y: -0.18, scale: 1.05 }, // skills
//   { x: 0.34, y: -0.18, scale: 1.07 }, // services
//   { x: -0.33, y: -0.18, scale: 1.04 }, // experience
//   { x: 0.34, y: -0.18, scale: 1.07 }, // projects
//   { x: -0.32, y: -0.18, scale: 1.05 }, // contact
// ] as const;

// // -----------------------------------------------------
// // POSSIBLE RIGHT HAND BONE NAMES
// // -----------------------------------------------------

// const RIGHT_HAND_BONE_NAMES = [
//   "RightHand",
//   "Hand.R",
//   "mixamorigRightHand",
//   "mixamorig:RightHand",
//   "Bip001_R_Hand",
//   "ValveBiped.Bip01_R_Hand",
// ] as const;

// // -----------------------------------------------------
// // TYPES
// // -----------------------------------------------------

// type FlightState = {
//   active: boolean;
//   startedAt: number;
//   duration: number;
//   from: THREE.Vector3;
//   to: THREE.Vector3;
//   targetIndex: number;
//   direction: 1 | -1;
// };

// // -----------------------------------------------------
// // EASING
// // -----------------------------------------------------

// function easeInOutCubic(t: number) {
//   return t < 0.5
//     ? 4 * t * t * t
//     : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }

// // -----------------------------------------------------
// // GET CURRENT SECTION
// // -----------------------------------------------------

// function getActiveSectionIndex() {
//   if (typeof window === "undefined") return 0;

//   const viewportCenter = window.innerHeight * 0.5;

//   let closestIndex = 0;
//   let closestDistance = Number.POSITIVE_INFINITY;

//   SECTION_IDS.forEach((id, index) => {
//     const section = document.getElementById(id);

//     if (!section) return;

//     const rect = section.getBoundingClientRect();

//     const sectionCenter = rect.top + rect.height * 0.5;

//     const distance = Math.abs(sectionCenter - viewportCenter);

//     if (distance < closestDistance) {
//       closestDistance = distance;
//       closestIndex = index;
//     }
//   });

//   return closestIndex;
// }

// // -----------------------------------------------------
// // FIND HAND BONE
// // FIXES: Property 'add' does not exist on type 'never'
// // -----------------------------------------------------

// function findBoneByNames(
//   root: THREE.Object3D,
//   names: readonly string[]
// ): THREE.Object3D | null {
//   for (const name of names) {
//     const object = root.getObjectByName(name);

//     if (object) {
//       return object;
//     }
//   }

//   return null;
// }

// // -----------------------------------------------------
// // DEVELOPER CHARACTER
// // -----------------------------------------------------

// function DeveloperModel() {
//   const root = useRef<THREE.Group>(null);

//   const animatedModel = useRef<THREE.Group>(null);

//   const laptopAnchor = useRef<THREE.Group>(null);

//   const { viewport } = useThree();

//   // ---------------------------------------------------
//   // LOAD CHARACTER
//   // ---------------------------------------------------

//   const characterGltf = useGLTF(CHARACTER_MODEL_URL);

//   // ---------------------------------------------------
//   // LOAD LAPTOP
//   // ---------------------------------------------------

//   const laptopGltf = useGLTF(LAPTOP_MODEL_URL);

//   // ---------------------------------------------------
//   // ANIMATIONS
//   // ---------------------------------------------------

//   const { actions } = useAnimations(
//     characterGltf.animations,
//     animatedModel
//   );

//   // ---------------------------------------------------
//   // SCROLL MOTION
//   // ---------------------------------------------------

//   const motion = useRef({
//     lastY: 0,
//     lastTime: 0,
//     velocity: 0,
//     smoothVelocity: 0,
//     lastScrollAt: 0,

//     activeIndex: 0,
//     targetIndex: 0,

//     reducedMotion: false,
//   });

//   // ---------------------------------------------------
//   // FLIGHT STATE
//   // ---------------------------------------------------

//   const flight = useRef<FlightState>({
//     active: false,

//     startedAt: 0,

//     duration: 950,

//     from: new THREE.Vector3(),

//     to: new THREE.Vector3(),

//     targetIndex: 0,

//     direction: 1,
//   });

//   // ---------------------------------------------------
//   // CHARACTER ANIMATIONS
//   // ---------------------------------------------------

//   const animation = useRef<{
//     idle?: THREE.AnimationAction;
//     walk?: THREE.AnimationAction;
//     run?: THREE.AnimationAction;
//   }>({});

//   const desiredPosition = useMemo(
//     () => new THREE.Vector3(),
//     []
//   );

//   // ---------------------------------------------------
//   // SETUP CHARACTER + LAPTOP MESHES
//   // ---------------------------------------------------

//   useEffect(() => {
//     characterGltf.scene.traverse((object) => {
//       if (object instanceof THREE.Mesh) {
//         object.frustumCulled = false;

//         object.castShadow = true;

//         object.receiveShadow = true;
//       }
//     });

//     laptopGltf.scene.traverse((object) => {
//       if (object instanceof THREE.Mesh) {
//         object.frustumCulled = false;

//         object.castShadow = true;

//         object.receiveShadow = true;
//       }
//     });
//   }, [characterGltf.scene, laptopGltf.scene]);

//   // ---------------------------------------------------
//   // ATTACH LAPTOP TO RIGHT HAND
//   // ---------------------------------------------------

//   useEffect(() => {
//     const currentAnimatedModel = animatedModel.current;

//     const currentLaptop = laptopAnchor.current;

//     if (!currentAnimatedModel || !currentLaptop) return;

//     const handBone = findBoneByNames(
//       characterGltf.scene,
//       RIGHT_HAND_BONE_NAMES
//     );

//     if (handBone) {
//       // -----------------------------------------------
//       // Laptop attached directly to hand
//       // -----------------------------------------------

//       handBone.add(currentLaptop);

//       currentLaptop.position.set(
//         0.06,
//         0.02,
//         0.05
//       );

//       currentLaptop.rotation.set(
//         -0.25,
//         -0.15,
//         0.35
//       );

//       currentLaptop.scale.setScalar(0.22);
//     } else {
//       // -----------------------------------------------
//       // Fallback if hand bone name is not detected
//       // -----------------------------------------------

//       currentAnimatedModel.add(currentLaptop);

//       currentLaptop.position.set(
//         0.22,
//         0.55,
//         0.18
//       );

//       currentLaptop.rotation.set(
//         -0.15,
//         -0.25,
//         0.2
//       );

//       currentLaptop.scale.setScalar(0.22);

//       console.warn(
//         "DeveloperModel: Right hand bone not found. Laptop attached using fallback position."
//       );
//     }

//     return () => {
//       currentLaptop.removeFromParent();
//     };
//   }, [characterGltf.scene]);

//   // ---------------------------------------------------
//   // SETUP IDLE / WALK / RUN
//   // ---------------------------------------------------

//   useEffect(() => {
//     if (!characterGltf.animations.length) return;

//     // -----------------------------------------------
//     // IDLE
//     // -----------------------------------------------

//     const idleClip =
//       characterGltf.animations.find((clip) =>
//         clip.name
//           .toLowerCase()
//           .includes("idle")
//       ) || characterGltf.animations[0];

//     // -----------------------------------------------
//     // RUN
//     // -----------------------------------------------

//     const runClip =
//       characterGltf.animations.find((clip) =>
//         clip.name
//           .toLowerCase()
//           .includes("run")
//       ) ||
//       characterGltf.animations[1] ||
//       characterGltf.animations[0];

//     // -----------------------------------------------
//     // WALK
//     // -----------------------------------------------

//     const walkClip =
//       characterGltf.animations.find((clip) =>
//         clip.name
//           .toLowerCase()
//           .includes("walk")
//       ) ||
//       characterGltf.animations[2] ||
//       characterGltf.animations[0];

//     const idle =
//       actions[idleClip.name] || undefined;

//     const walk =
//       actions[walkClip.name] || undefined;

//     const run =
//       actions[runClip.name] || undefined;

//     animation.current = {
//       idle,
//       walk,
//       run,
//     };

//     // -----------------------------------------------
//     // START ALL ANIMATIONS
//     // -----------------------------------------------

//     [idle, walk, run].forEach((action) => {
//       if (!action) return;

//       action.enabled = true;

//       action.setEffectiveWeight(0);

//       action.play();
//     });

//     // Start with idle
//     idle?.setEffectiveWeight(1);

//     return () => {
//       [idle, walk, run].forEach((action) =>
//         action?.stop()
//       );
//     };
//   }, [actions, characterGltf.animations]);

//   // ---------------------------------------------------
//   // SCROLL / SECTION MOVEMENT
//   // ---------------------------------------------------

//   useEffect(() => {
//     const reducedMotionQuery =
//       window.matchMedia(
//         "(prefers-reduced-motion: reduce)"
//       );

//     const syncReducedMotion = () => {
//       motion.current.reducedMotion =
//         reducedMotionQuery.matches;
//     };

//     syncReducedMotion();

//     reducedMotionQuery.addEventListener(
//       "change",
//       syncReducedMotion
//     );

//     // -----------------------------------------------
//     // CALCULATE SECTION POSITION
//     // -----------------------------------------------

//     const pointFor = (index: number) => {
//       const point =
//         WAYPOINTS[index] || WAYPOINTS[0];

//       return new THREE.Vector3(
//         viewport.width * point.x,
//         viewport.height * point.y,
//         0
//       );
//     };

//     // -----------------------------------------------
//     // START FLYING
//     // -----------------------------------------------

//     const startFlight = (
//       targetIndex: number,
//       direction: 1 | -1
//     ) => {
//       if (
//         !root.current ||
//         motion.current.reducedMotion
//       ) {
//         return;
//       }

//       flight.current = {
//         active: true,

//         startedAt: performance.now(),

//         duration: 950,

//         from:
//           root.current.position.clone(),

//         to: pointFor(targetIndex),

//         targetIndex,

//         direction,
//       };

//       motion.current.targetIndex =
//         targetIndex;
//     };

//     // -----------------------------------------------
//     // HANDLE SCROLL
//     // -----------------------------------------------

//     const onScroll = () => {
//       const now = performance.now();

//       const currentY = window.scrollY;

//       const elapsed = Math.max(
//         now - motion.current.lastTime,
//         16
//       );

//       const deltaY =
//         currentY - motion.current.lastY;

//       const velocity =
//         (deltaY / elapsed) * 1000;

//       const nextSection =
//         getActiveSectionIndex();

//       motion.current.velocity = velocity;

//       motion.current.lastY = currentY;

//       motion.current.lastTime = now;

//       motion.current.lastScrollAt = now;

//       if (
//         nextSection !==
//         motion.current.activeIndex
//       ) {
//         const oldSection =
//           motion.current.activeIndex;

//         const direction: 1 | -1 =
//           nextSection > oldSection
//             ? 1
//             : -1;

//         motion.current.activeIndex =
//           nextSection;

//         motion.current.targetIndex =
//           nextSection;

//         // -------------------------------------------
//         // Fast scroll = fly
//         // -------------------------------------------

//         const fastJump =
//           Math.abs(velocity) > 2100 ||
//           Math.abs(deltaY) >
//             window.innerHeight * 0.28;

//         if (fastJump) {
//           startFlight(
//             nextSection,
//             direction
//           );
//         }
//       }
//     };

//     // -----------------------------------------------
//     // NAVBAR CLICK = FLY
//     // -----------------------------------------------

//     const onAnchorClick = (
//       event: MouseEvent
//     ) => {
//       const target =
//         event.target as HTMLElement | null;

//       const anchor =
//         target?.closest<HTMLAnchorElement>(
//           'a[href^="#"]'
//         );

//       if (!anchor) return;

//       const id =
//         anchor
//           .getAttribute("href")
//           ?.slice(1);

//       if (!id) return;

//       const nextIndex =
//         SECTION_IDS.indexOf(
//           id as (typeof SECTION_IDS)[number]
//         );

//       if (nextIndex < 0) return;

//       const direction: 1 | -1 =
//         nextIndex >=
//         motion.current.activeIndex
//           ? 1
//           : -1;

//       startFlight(
//         nextIndex,
//         direction
//       );
//     };

//     // -----------------------------------------------
//     // INITIAL VALUES
//     // -----------------------------------------------

//     motion.current.lastY =
//       window.scrollY;

//     motion.current.lastTime =
//       performance.now();

//     motion.current.activeIndex =
//       getActiveSectionIndex();

//     motion.current.targetIndex =
//       motion.current.activeIndex;

//     // -----------------------------------------------
//     // EVENTS
//     // -----------------------------------------------

//     window.addEventListener(
//       "scroll",
//       onScroll,
//       {
//         passive: true,
//       }
//     );

//     document.addEventListener(
//       "click",
//       onAnchorClick,
//       true
//     );

//     // -----------------------------------------------
//     // CLEANUP
//     // -----------------------------------------------

//     return () => {
//       reducedMotionQuery.removeEventListener(
//         "change",
//         syncReducedMotion
//       );

//       window.removeEventListener(
//         "scroll",
//         onScroll
//       );

//       document.removeEventListener(
//         "click",
//         onAnchorClick,
//         true
//       );
//     };
//   }, [
//     viewport.height,
//     viewport.width,
//   ]);

//   // ---------------------------------------------------
//   // FRAME ANIMATION
//   // ---------------------------------------------------

//   useFrame((_, delta) => {
//     if (!root.current) return;

//     const now = performance.now();

//     const idle =
//       animation.current.idle;

//     const walk =
//       animation.current.walk;

//     const run =
//       animation.current.run;

//     // -------------------------------------------------
//     // SMOOTH SCROLL VELOCITY
//     // -------------------------------------------------

//     motion.current.smoothVelocity =
//       THREE.MathUtils.damp(
//         motion.current.smoothVelocity,
//         motion.current.velocity,
//         8,
//         delta
//       );

//     // -------------------------------------------------
//     // STOP VELOCITY AFTER SCROLL
//     // -------------------------------------------------

//     if (
//       now -
//         motion.current.lastScrollAt >
//       140
//     ) {
//       motion.current.velocity =
//         THREE.MathUtils.damp(
//           motion.current.velocity,
//           0,
//           13,
//           delta
//         );
//     }

//     const speed = Math.abs(
//       motion.current.smoothVelocity
//     );

//     const scrolling =
//       speed > 24 &&
//       now -
//         motion.current.lastScrollAt <
//         260;

//     const running =
//       speed > 1150;

//     const flying =
//       flight.current.active &&
//       !motion.current.reducedMotion;

//     // -------------------------------------------------
//     // ANIMATION BLENDING
//     // -------------------------------------------------

//     const idleWeight = flying
//       ? 1
//       : scrolling
//       ? 0.02
//       : 1;

//     const walkWeight = flying
//       ? 0
//       : scrolling && !running
//       ? 0.98
//       : 0;

//     const runWeight = flying
//       ? 0
//       : scrolling && running
//       ? 0.95
//       : 0;

//     // -------------------------------------------------
//     // IDLE
//     // -------------------------------------------------

//     if (idle) {
//       idle.setEffectiveWeight(
//         THREE.MathUtils.damp(
//           idle.getEffectiveWeight(),
//           idleWeight,
//           11,
//           delta
//         )
//       );
//     }

//     // -------------------------------------------------
//     // WALK
//     // -------------------------------------------------

//     if (walk) {
//       walk.setEffectiveWeight(
//         THREE.MathUtils.damp(
//           walk.getEffectiveWeight(),
//           walkWeight,
//           13,
//           delta
//         )
//       );

//       walk.setEffectiveTimeScale(
//         THREE.MathUtils.clamp(
//           speed / 420,
//           0.7,
//           1.6
//         )
//       );
//     }

//     // -------------------------------------------------
//     // RUN
//     // -------------------------------------------------

//     if (run) {
//       run.setEffectiveWeight(
//         THREE.MathUtils.damp(
//           run.getEffectiveWeight(),
//           runWeight,
//           13,
//           delta
//         )
//       );

//       run.setEffectiveTimeScale(
//         THREE.MathUtils.clamp(
//           speed / 1050,
//           0.9,
//           1.45
//         )
//       );
//     }

//     // -------------------------------------------------
//     // CURRENT TARGET POSITION
//     // -------------------------------------------------

//     const point =
//       WAYPOINTS[
//         motion.current.targetIndex
//       ] || WAYPOINTS[0];

//     desiredPosition.set(
//       viewport.width * point.x,
//       viewport.height * point.y,
//       0
//     );

//     // -------------------------------------------------
//     // FLYING
//     // -------------------------------------------------

//     if (flying) {
//       const currentFlight =
//         flight.current;

//       const rawProgress =
//         THREE.MathUtils.clamp(
//           (now -
//             currentFlight.startedAt) /
//             currentFlight.duration,
//           0,
//           1
//         );

//       const progress =
//         easeInOutCubic(rawProgress);

//       // -----------------------------------------------
//       // CURVED FLIGHT
//       // -----------------------------------------------

//       const arc =
//         Math.sin(
//           Math.PI * rawProgress
//         ) *
//         viewport.height *
//         0.28;

//       root.current.position.lerpVectors(
//         currentFlight.from,
//         currentFlight.to,
//         progress
//       );

//       root.current.position.y += arc;

//       // -----------------------------------------------
//       // SUPERMAN TILT
//       // -----------------------------------------------

//       const supermanTilt =
//         currentFlight.direction *
//         -Math.PI *
//         0.5;

//       const spin =
//         currentFlight.direction *
//         Math.PI *
//         2 *
//         rawProgress;

//       root.current.rotation.z =
//         THREE.MathUtils.damp(
//           root.current.rotation.z,
//           supermanTilt,
//           10,
//           delta
//         );

//       root.current.rotation.x =
//         THREE.MathUtils.damp(
//           root.current.rotation.x,
//           -0.28,
//           9,
//           delta
//         );

//       // Full rotation
//       root.current.rotation.y =
//         Math.PI + spin;

//       // -----------------------------------------------
//       // FLIGHT SCALE
//       // -----------------------------------------------

//       const flightScale =
//         point.scale *
//         (1 +
//           Math.sin(
//             Math.PI * rawProgress
//           ) *
//             0.15);

//       const nextScale =
//         THREE.MathUtils.damp(
//           root.current.scale.x,
//           flightScale,
//           8,
//           delta
//         );

//       root.current.scale.setScalar(
//         nextScale
//       );

//       // -----------------------------------------------
//       // FLIGHT FINISHED
//       // -----------------------------------------------

//       if (rawProgress >= 1) {
//         currentFlight.active = false;

//         motion.current.activeIndex =
//           currentFlight.targetIndex;

//         motion.current.targetIndex =
//           currentFlight.targetIndex;
//       }
//     }

//     // -------------------------------------------------
//     // NORMAL WALK / RUN MOVEMENT
//     // -------------------------------------------------

//     else {
//       root.current.position.x =
//         THREE.MathUtils.damp(
//           root.current.position.x,
//           desiredPosition.x,
//           4.4,
//           delta
//         );

//       root.current.position.y =
//         THREE.MathUtils.damp(
//           root.current.position.y,
//           desiredPosition.y,
//           4.4,
//           delta
//         );

//       root.current.position.z =
//         THREE.MathUtils.damp(
//           root.current.position.z,
//           0,
//           6,
//           delta
//         );

//       // -----------------------------------------------
//       // RESET FLIGHT ROTATION
//       // -----------------------------------------------

//       root.current.rotation.z =
//         THREE.MathUtils.damp(
//           root.current.rotation.z,
//           0,
//           8,
//           delta
//         );

//       root.current.rotation.x =
//         THREE.MathUtils.damp(
//           root.current.rotation.x,
//           0,
//           8,
//           delta
//         );

//       // -----------------------------------------------
//       // SMALL LEAN BASED ON SCROLL
//       // -----------------------------------------------

//       const lean =
//         THREE.MathUtils.clamp(
//           motion.current
//             .smoothVelocity / 2500,
//           -1,
//           1
//         );

//       root.current.rotation.y =
//         THREE.MathUtils.damp(
//           root.current.rotation.y,
//           Math.PI + lean * 0.12,
//           7,
//           delta
//         );

//       // -----------------------------------------------
//       // NORMAL SCALE
//       // -----------------------------------------------

//       const nextScale =
//         THREE.MathUtils.damp(
//           root.current.scale.x,
//           point.scale,
//           8,
//           delta
//         );

//       root.current.scale.setScalar(
//         nextScale
//       );
//     }
//   });

//   // ---------------------------------------------------
//   // CHARACTER JSX
//   // ---------------------------------------------------

//   return (
//     <group ref={root}>
//       <group
//         ref={animatedModel}
//         position={[0, -0.95, 0]}
//       >
//         <primitive
//           object={characterGltf.scene}
//         />

//         <group ref={laptopAnchor}>
//           <primitive
//             object={laptopGltf.scene}
//           />
//         </group>
//       </group>
//     </group>
//   );
// }

// // -----------------------------------------------------
// // THREE.JS SCENE
// // -----------------------------------------------------

// function Scene() {
//   return (
//     <>
//       <hemisphereLight
//         args={[
//           "#ffffff",
//           "#10141c",
//           2.2,
//         ]}
//       />

//       <directionalLight
//         position={[4, 6, 5]}
//         intensity={3.4}
//         color="#ffffff"
//       />

//       <directionalLight
//         position={[-4, 2, 3]}
//         intensity={2.1}
//         color="#4EF0C4"
//       />

//       <Suspense fallback={null}>
//         <DeveloperModel />
//       </Suspense>
//     </>
//   );
// }

// // -----------------------------------------------------
// // MAIN COMPONENT
// // -----------------------------------------------------

// export default function ScrollCharacter() {
//   return (
//     <div
//       className="
//         pointer-events-none
//         fixed
//         inset-0
//         z-30
//         hidden
//         md:block
//       "
//       aria-hidden="true"
//     >
//       <Canvas
//         dpr={[1, 1.5]}
//         camera={{
//           position: [0, 0, 5.4],
//           fov: 38,
//           near: 0.1,
//           far: 100,
//         }}
//         gl={{
//           alpha: true,
//           antialias: true,
//           powerPreference:
//             "high-performance",
//         }}
//       >
//         <Scene />
//       </Canvas>
//     </div>
//   );
// }

// // -----------------------------------------------------
// // PRELOAD MODELS
// // -----------------------------------------------------

// useGLTF.preload(
//   CHARACTER_MODEL_URL
// );

// useGLTF.preload(
//   LAPTOP_MODEL_URL
// );
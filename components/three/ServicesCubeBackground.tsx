"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ServicesCubeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // -----------------------------------------
    // SCENE
    // -----------------------------------------

    const scene = new THREE.Scene();

    // -----------------------------------------
    // CAMERA
    // -----------------------------------------

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.z = 18;

    // -----------------------------------------
    // RENDERER
    // -----------------------------------------

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // -----------------------------------------
    // INSTANCED CUBES
    // -----------------------------------------

    const cubeCount = 220;

    const geometry = new THREE.BoxGeometry(
      0.22,
      0.22,
      0.22
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0x55e6d0,
      transparent: true,
      opacity: 0.22,
    });

    const cubes = new THREE.InstancedMesh(
      geometry,
      material,
      cubeCount
    );

    scene.add(cubes);

    // -----------------------------------------
    // INITIAL POSITIONS
    // -----------------------------------------

    const dummy = new THREE.Object3D();

    const positions: {
      x: number;
      y: number;
      z: number;
      speed: number;
      rotationSpeed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < cubeCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(22);
      const y = THREE.MathUtils.randFloatSpread(12);
      const z = THREE.MathUtils.randFloat(-8, 4);

      const scale = THREE.MathUtils.randFloat(
        0.5,
        1.6
      );

      dummy.position.set(x, y, z);

      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      dummy.scale.setScalar(scale);

      dummy.updateMatrix();

      cubes.setMatrixAt(i, dummy.matrix);

      positions.push({
        x,
        y,
        z,

        speed:
          THREE.MathUtils.randFloat(
            0.05,
            0.18
          ),

        rotationSpeed:
          THREE.MathUtils.randFloat(
            0.1,
            0.35
          ),

        phase:
          Math.random() * Math.PI * 2,
      });
    }

    cubes.instanceMatrix.needsUpdate = true;

    // -----------------------------------------
    // MOUSE
    // -----------------------------------------

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      mouseX =
        (event.clientX / window.innerWidth - 0.5) *
        2;

      mouseY =
        (event.clientY / window.innerHeight -
          0.5) *
        2;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    // -----------------------------------------
    // CLOCK
    // -----------------------------------------

    const clock = new THREE.Clock();

    // -----------------------------------------
    // ANIMATION
    // -----------------------------------------

    let animationFrameId: number;

    const animate = () => {
      animationFrameId =
        requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth camera parallax

      camera.position.x +=
        (mouseX * 0.8 - camera.position.x) *
        0.025;

      camera.position.y +=
        (-mouseY * 0.5 - camera.position.y) *
        0.025;

      camera.lookAt(0, 0, 0);

      // Animate cubes

      positions.forEach((data, i) => {
        const floatingY =
          data.y +
          Math.sin(
            time * data.speed * 3 +
              data.phase
          ) *
            0.5;

        dummy.position.set(
          data.x,
          floatingY,
          data.z
        );

        dummy.rotation.x =
          time * data.rotationSpeed;

        dummy.rotation.y =
          time *
          data.rotationSpeed *
          0.7;

        dummy.updateMatrix();

        cubes.setMatrixAt(
          i,
          dummy.matrix
        );
      });

      cubes.instanceMatrix.needsUpdate =
        true;

      // Whole field slowly rotates

      cubes.rotation.y =
        Math.sin(time * 0.08) * 0.08;

      cubes.rotation.x =
        Math.sin(time * 0.05) * 0.025;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // -----------------------------------------
    // RESIZE
    // -----------------------------------------

    const handleResize = () => {
      if (!container) return;

      const width =
        container.clientWidth;

      const height =
        container.clientHeight;

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (
        renderer.domElement.parentElement ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        absolute
        inset-0
        z-0
        pointer-events-none
        opacity-70
      "
    />
  );
}
"use client";

import { useEffect, useRef } from "react";

// IMPORTANT: use the WebGPU build, like the official example
import * as THREE from "three/webgpu";
import {
  bumpMap,
  cameraPosition,
  color,
  max,
  mix,
  normalWorldGeometry,
  normalize,
  output,
  positionWorld,
  step,
  texture,
  uniform,
  uv,
  vec3,
  vec4,
} from "three/tsl";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type EarthGlobeProps = {
  className?: string;
};

export default function EarthGlobe({
  className = "",
}: EarthGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGPU support check
    if (!("gpu" in navigator)) {
      console.warn("WebGPU is not supported in this browser.");
      return;
    }

    let mounted = true;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGPURenderer;
    let controls: OrbitControls;
    let globe: THREE.Mesh;
    let animationId = 0;

    const clock = new THREE.Clock();

    const init = async () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
      camera.position.set(4.5, 2, 3);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // sun
      const sun = new THREE.DirectionalLight("#ffffff", 2);
      sun.position.set(0, 0, 3);
      scene.add(sun);

      // uniforms
      const atmosphereDayColor = uniform(color("#4db2ff"));
      const atmosphereTwilightColor = uniform(color("#bc490b"));
      const roughnessLow = uniform(0.25);
      const roughnessHigh = uniform(0.35);

      // textures
      const textureLoader = new THREE.TextureLoader();

      const dayTexture = textureLoader.load(
        "https://threejs.org/examples/textures/planets/earth_day_4096.jpg"
      );
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      dayTexture.anisotropy = 8;

      const nightTexture = textureLoader.load(
        "https://threejs.org/examples/textures/planets/earth_night_4096.jpg"
      );
      nightTexture.colorSpace = THREE.SRGBColorSpace;
      nightTexture.anisotropy = 8;

      const bumpRoughnessCloudsTexture = textureLoader.load(
        "https://threejs.org/examples/textures/planets/earth_bump_roughness_clouds_4096.jpg"
      );
      bumpRoughnessCloudsTexture.anisotropy = 8;

      // fresnel
      const viewDirection = positionWorld.sub(cameraPosition).normalize();
      const fresnel = viewDirection.dot(normalWorldGeometry).abs().oneMinus().toVar();

      // sun orientation
      const sunOrientation = normalWorldGeometry.dot(normalize(sun.position)).toVar();

      // atmosphere color
      const atmosphereColor = mix(
        atmosphereTwilightColor,
        atmosphereDayColor,
        sunOrientation.smoothstep(-0.25, 0.75)
      );

      // globe material
      const globeMaterial = new THREE.MeshStandardNodeMaterial();

      const cloudsStrength = texture(bumpRoughnessCloudsTexture, uv()).b.smoothstep(0.2, 1);

      globeMaterial.colorNode = mix(
        texture(dayTexture),
        vec3(1),
        cloudsStrength.mul(2)
      );

      const roughness = max(
        texture(bumpRoughnessCloudsTexture).g,
        step(0.01, cloudsStrength)
      );

      globeMaterial.roughnessNode = roughness.remap(0, 1, roughnessLow, roughnessHigh);

      const night = texture(nightTexture);
      const dayStrength = sunOrientation.smoothstep(-0.25, 0.5);

      const atmosphereDayStrength = sunOrientation.smoothstep(-0.5, 1);
      const atmosphereMix = atmosphereDayStrength.mul(fresnel.pow(2)).clamp(0, 1);

      let finalOutput = mix(night.rgb, output.rgb, dayStrength);
      finalOutput = mix(finalOutput, atmosphereColor, atmosphereMix);

      globeMaterial.outputNode = vec4(finalOutput, output.a);

      const bumpElevation = max(
        texture(bumpRoughnessCloudsTexture).r,
        cloudsStrength
      );
      globeMaterial.normalNode = bumpMap(bumpElevation);

      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      globe = new THREE.Mesh(sphereGeometry, globeMaterial);
      scene.add(globe);

      // atmosphere shell
      const atmosphereMaterial = new THREE.MeshBasicNodeMaterial({
        side: THREE.BackSide,
        transparent: true,
      });

      let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3);
      alpha = alpha.mul(sunOrientation.smoothstep(-0.5, 1));

      atmosphereMaterial.outputNode = vec4(atmosphereColor, alpha);

      const atmosphere = new THREE.Mesh(sphereGeometry, atmosphereMaterial);
      atmosphere.scale.setScalar(1.04);
      scene.add(atmosphere);

      // renderer
      renderer = new THREE.WebGPURenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      if (!mounted) return;
      container.appendChild(renderer.domElement);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 1.8;
      controls.maxDistance = 10;

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", onResize);

      const animate = async () => {
        if (!mounted) return;

        const delta = clock.getDelta();
        globe.rotation.y += delta * 0.25 * 0.1; // same feel as official example

        controls.update();

renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    let cleanupResize: (() => void) | undefined;

    init().then((cleanup) => {
      cleanupResize = cleanup;
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(animationId);

      cleanupResize?.();

      controls?.dispose();
      renderer?.dispose();

      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`h-full w-full ${className}`} />;
}
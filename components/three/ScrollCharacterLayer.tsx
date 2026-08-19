"use client";

import { useEffect, useRef } from "react";
import ScrollCharacter from "@/components/three/ScrollCharacter";

export default function ScrollCharacterLayer() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const updateCharacter = () => {
      const scrollY = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight;

      const viewportHeight = window.innerHeight;

      const maxScroll = Math.max(
        documentHeight - viewportHeight,
        1
      );

      /*
       * ================================
       * FADE IN
       * ================================
       *
       * Character:
       * 0px   -> invisible
       * 100px -> still invisible
       * 450px -> fully visible
       */

      const fadeInStart = 100;

      const fadeInEnd = Math.min(
        450,
        maxScroll * 0.22
      );

      /*
       * ================================
       * FADE OUT
       * ================================
       *
       * Start hiding roughly one viewport
       * before the bottom.
       */

      const fadeOutStart = Math.max(
        fadeInEnd + 100,
        maxScroll - viewportHeight * 0.9
      );

      const fadeOutEnd = Math.max(
        fadeOutStart + 1,
        maxScroll - 20
      );

      /*
       * Maximum character visibility.
       */

      const maxOpacity =
        window.innerWidth >= 768
          ? 0.26
          : 0.18;

      let opacity = 0;

      /* ================================
         TOP → FADE IN
      ================================= */

      if (scrollY <= fadeInStart) {
        opacity = 0;
      }

      else if (scrollY < fadeInEnd) {
        const progress =
          (scrollY - fadeInStart) /
          Math.max(
            fadeInEnd - fadeInStart,
            1
          );

        opacity =
          clamp(progress, 0, 1) *
          maxOpacity;
      }

      /* ================================
         MIDDLE → VISIBLE
      ================================= */

      else if (scrollY < fadeOutStart) {
        opacity = maxOpacity;
      }

      /* ================================
         BOTTOM → FADE OUT
      ================================= */

      else if (scrollY < fadeOutEnd) {
        const progress =
          (scrollY - fadeOutStart) /
          Math.max(
            fadeOutEnd -
              fadeOutStart,
            1
          );

        opacity =
          maxOpacity *
          (1 - clamp(progress, 0, 1));
      }

      /* ================================
         BOTTOM → HIDDEN
      ================================= */

      else {
        opacity = 0;
      }

      /*
       * Slight movement during reveal/hide
       * makes the transition less abrupt.
       */

      const opacityProgress =
        maxOpacity > 0
          ? opacity / maxOpacity
          : 0;

      const translateY =
        12 -
        opacityProgress * 12;

      const scale =
        0.98 +
        opacityProgress * 0.02;

      wrapper.style.opacity =
        opacity.toString();

      wrapper.style.transform = `
        translate3d(
          0,
          ${translateY}px,
          0
        )
        scale(${scale})
      `;
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current =
        requestAnimationFrame(() => {
          updateCharacter();
          frameRef.current = null;
        });
    };

    /*
     * Initial state.
     */

    updateCharacter();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      window.removeEventListener(
        "resize",
        requestUpdate
      );

      if (frameRef.current !== null) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="
        pointer-events-none
        fixed
        inset-0
        z-[10]
        overflow-hidden
      "
      style={{
        /*
         * IMPORTANT:
         * Completely invisible initially.
         */
        opacity: 0,

        transform:
          "translate3d(0, 12px, 0) scale(0.98)",

        transformOrigin: "center center",

        willChange:
          "opacity, transform",
      }}
      aria-hidden="true"
    >
      <ScrollCharacter />
    </div>
  );
}
"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, type PointerEvent } from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { profile } from "@/lib/data";

const StackNetwork = dynamic(
  () => import("@/components/three/StackNetwork"),
  { ssr: false }
);

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    const network = networkRef.current;
    const title = titleRef.current;
    const glow = glowRef.current;
    const cursor = cursorRef.current;

    if (!hero || !content || !network || !title || !glow || !cursor) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      gsap.set(
        [
          ".hero-eyebrow",
          ".hero-title-mask",
          ".hero-role",
          ".hero-summary",
          ".hero-actions",
          network,
        ],
        { clearProps: "all", autoAlpha: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".hero-eyebrow", { autoAlpha: 0, y: 16 });
      gsap.set(".hero-kicker-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".hero-title-mask", {
        autoAlpha: 0,
        yPercent: 105,
        rotateX: -9,
        transformOrigin: "left bottom",
      });
      gsap.set(".hero-title-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".hero-role", { autoAlpha: 0, y: 18 });
      gsap.set(".hero-summary", { autoAlpha: 0, y: 22 });
      gsap.set(".hero-actions", { autoAlpha: 0, y: 16 });
      gsap.set(network, {
        autoAlpha: 0,
        scale: 0.9,
        x: 45,
        filter: "blur(12px)",
        transformOrigin: "55% 50%",
      });
      gsap.set(".hero-orbit", { autoAlpha: 0, scale: 0.82 });
      gsap.set(".hero-orbit-dot", { autoAlpha: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .to(".hero-eyebrow", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08)
        .to(".hero-kicker-line", { scaleX: 1, duration: 0.7 }, 0.16)
        .to(
          ".hero-title-mask",
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1.05,
            ease: "expo.out",
          },
          0.22
        )
        .to(".hero-title-rule", { scaleX: 1, duration: 0.9 }, 0.48)
        .to(
          network,
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1.35,
            ease: "expo.out",
          },
          0.25
        )
        .to(
          ".hero-orbit",
          {
            autoAlpha: 0.32,
            scale: 1,
            duration: 1.2,
          },
          0.52
        )
        .to(".hero-orbit-dot", { autoAlpha: 0.75, duration: 0.65 }, 0.72)
        .to(".hero-role", { autoAlpha: 1, y: 0, duration: 0.65 }, 0.6)
        .to(".hero-summary", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.72)
        .to(".hero-actions", { autoAlpha: 1, y: 0, duration: 0.65 }, 0.84);

      // Ambient scene motion. Slow enough to be felt, not noticed.
      gsap.to(".hero-orbit-a", {
        rotation: 360,
        duration: 34,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".hero-orbit-b", {
        rotation: -360,
        duration: 42,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".hero-orbit-dot", {
        rotation: 360,
        duration: 14,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      gsap.to(".hero-scan", {
        xPercent: 165,
        duration: 5.5,
        repeat: -1,
        repeatDelay: 2.4,
        ease: "power2.inOut",
      });
}, hero);

    const contentX = gsap.quickTo(content, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const contentY = gsap.quickTo(content, "y", {
      duration: 0.8,
      ease: "power3.out",
    });
    const networkX = gsap.quickTo(network, "x", {
      duration: 1,
      ease: "power3.out",
    });
    const networkY = gsap.quickTo(network, "y", {
      duration: 1,
      ease: "power3.out",
    });
    const titleRotateX = gsap.quickTo(title, "rotationX", {
      duration: 0.75,
      ease: "power3.out",
    });
    const titleRotateY = gsap.quickTo(title, "rotationY", {
      duration: 0.75,
      ease: "power3.out",
    });
    const glowX = gsap.quickTo(glow, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const glowY = gsap.quickTo(glow, "y", {
      duration: 0.7,
      ease: "power3.out",
    });
    const cursorX = gsap.quickTo(cursor, "x", {
      duration: 0.22,
      ease: "power2.out",
    });
    const cursorY = gsap.quickTo(cursor, "y", {
      duration: 0.22,
      ease: "power2.out",
    });
    const cursorOpacity = gsap.quickTo(cursor, "opacity", {
      duration: 0.25,
      ease: "power2.out",
    });

    const handleMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = hero.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const nx = localX / rect.width - 0.5;
      const ny = localY / rect.height - 0.5;

      hero.style.setProperty("--mx", `${localX}px`);
      hero.style.setProperty("--my", `${localY}px`);

      contentX(nx * -10);
      contentY(ny * -7);
      networkX(nx * 30);
      networkY(ny * 22);
      titleRotateY(nx * 2.4);
      titleRotateX(ny * -1.6);
      glowX(nx * 34);
      glowY(ny * 26);
      cursorX(localX - 5);
      cursorY(localY - 5);
      cursorOpacity(0.85);
    };

    const handleLeave = () => {
      contentX(0);
      contentY(0);
      networkX(0);
      networkY(0);
      titleRotateY(0);
      titleRotateX(0);
      glowX(0);
      glowY(0);
      cursorOpacity(0);
    };

    hero.addEventListener("pointermove", handleMove);
    hero.addEventListener("pointerleave", handleLeave);

    return () => {
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", handleLeave);
      ctx.revert();
    };
  }, []);

  const handleTitlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty("--title-x", `${x}%`);
    element.style.setProperty("--title-y", `${y}%`);
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero-shell relative isolate min-h-screen w-full overflow-hidden bg-base"
    >
      {/* Base grid + vignette */}
      <div className="hero-grid pointer-events-none absolute inset-0 z-0" />
      <div className="hero-vignette pointer-events-none absolute inset-0 z-[1]" />

      {/* Cursor-reactive light field */}
      <div className="hero-pointer-light pointer-events-none absolute inset-0 z-[1]" />
      <div ref={glowRef} className="hero-ambient-glow pointer-events-none absolute z-[1]" />
      <div ref={cursorRef} className="hero-cursor-dot pointer-events-none absolute left-0 top-0 z-[30] hidden md:block" />

      {/* Decorative scan beam */}
      <div className="hero-scan-wrap pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="hero-scan" />
      </div>

      {/* Three.js scene */}
      <div
        ref={networkRef}
        className="hero-network pointer-events-none absolute inset-0 z-[3] md:pointer-events-auto md:inset-y-0 md:left-[39%] md:right-[-8%] lg:left-[42%] lg:right-[-4%]"
      >
        <StackNetwork />
      </div>

      {/* Technical orbit overlays around the 3D area */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[4] hidden w-[61%] items-center justify-center md:flex">
        <div className="hero-orbit hero-orbit-a absolute aspect-square w-[62%] rounded-full" />
        <div className="hero-orbit hero-orbit-b absolute aspect-square w-[46%] rounded-full" />
        <div className="hero-orbit-dot absolute aspect-square w-[54%] rounded-full">
          <span />
        </div>
      </div>

      {/* Left readability gradient */}
      <div className="hero-readability pointer-events-none absolute inset-0 z-[5]" />

      {/* Main content */}
      <div
        ref={contentRef}
        className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-[90%] flex-col justify-center px-6 pb-16 pt-24 xl:w-[98%]"
      >
        <div className="hero-eyebrow pointer-events-auto mb-5 flex w-fit items-center gap-3">
          <span className="hero-status" aria-hidden="true">
            <span />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
            Full-Stack Developer
          </p>
          <span className="hero-kicker-line h-px w-11 bg-ink/20" />
        </div>

        <div
          ref={titleRef}
          onPointerMove={handleTitlePointerMove}
          className="hero-title-stage pointer-events-auto relative w-fit [perspective:900px]"
        >
          <div className="overflow-visible pb-2">
            <div className="hero-title-mask relative">
              <h1
                className="
                  hero-title
                  relative
                  z-[2]
                  select-none
                  font-display
                  text-[13vw]
                  font-semibold
                  leading-[0.96]
                  text-ink
                  sm:text-6xl
                  md:text-7xl
                  lg:text-[5.6rem]
                  xl:text-[6.25rem]
                "
              >
                {profile.name}
              </h1>

              {/* very subtle hover sheen */}
              <span
                aria-hidden="true"
                className="
                  hero-title-hover-sheen
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-[3]
                  w-full
                "
              />
            </div>
          </div>
          <div className="hero-title-rule mt-2 h-px w-full origin-left" />
        </div>

        <div className="hero-role pointer-events-auto mt-6 flex w-fit max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted md:text-white">
          <span>{profile.role}</span>
          <span className="hero-role-separator" aria-hidden="true" />
          <span>{profile.roleSecondary}</span>
        </div>

        <div className=" pointer-events-auto mt-7 max-w-xl">
          <p className="text-white leading-7 text-ink/72 md:text-[17px]">
            {profile.summary}
          </p>
        </div>

        <div className="hero-actions pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
          {/* <a
            href="#projects"
            className="hero-primary group inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-xs text-ink"
          >
            Explore work
            <ArrowDownRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a> */}

          <div className="hero-location flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-xs text-muted">
            <MapPin size={13} className="shrink-0 text-teal" />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      {/* Bottom structural line */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 hidden h-px w-[calc(90%-3rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/10 to-transparent md:block" />

      <style jsx>{`
        .hero-shell {
          --mx: 62%;
          --my: 42%;
          --title-x: 50%;
          --title-y: 50%;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.032) 1px, transparent 1px);
          background-size: 44px 44px;
          opacity: 0.58;
          mask-image: radial-gradient(ellipse at 56% 48%, black 6%, transparent 74%);
          -webkit-mask-image: radial-gradient(ellipse at 56% 48%, black 6%, transparent 74%);
        }

        .hero-vignette {
          background:
            radial-gradient(circle at 73% 48%, transparent 0 18%, rgba(0, 0, 0, 0.16) 52%, rgba(0, 0, 0, 0.46) 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent 28%, transparent 72%, rgba(0, 0, 0, 0.2));
        }

        .hero-pointer-light {
          background: radial-gradient(
            430px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.075),
            rgba(255, 255, 255, 0.022) 28%,
            transparent 68%
          );
        }

        .hero-ambient-glow {
          right: 8%;
          top: 21%;
          width: min(44vw, 620px);
          aspect-ratio: 1;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.055), transparent 68%);
          filter: blur(18px);
        }

        .hero-cursor-dot {
          width: 10px;
          height: 10px;
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 9999px;
          opacity: 0;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.12);
        }

        .hero-scan {
          position: absolute;
          top: -15%;
          left: -38%;
          width: 20%;
          height: 130%;
          opacity: 0.12;
          transform: skewX(-14deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.07),
            transparent
          );
          filter: blur(16px);
        }

        .hero-network {
          mask-image: radial-gradient(ellipse at 58% 48%, black 24%, rgba(0, 0, 0, 0.9) 52%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse at 58% 48%, black 24%, rgba(0, 0, 0, 0.9) 52%, transparent 78%);
          will-change: transform, opacity, filter;
        }

        .hero-orbit {
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.012);
        }

        .hero-orbit-a::before,
        .hero-orbit-b::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -2px;
          width: 16%;
          height: 3px;
          transform: translateX(-50%);
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.58), transparent);
          filter: blur(0.2px);
        }

        .hero-orbit-b {
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.055);
        }

        .hero-orbit-dot span {
          position: absolute;
          top: -3px;
          left: 50%;
          width: 6px;
          height: 6px;
          transform: translateX(-50%);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.42);
        }

        .hero-readability {
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.78) 24%,
            rgba(0, 0, 0, 0.46) 44%,
            rgba(0, 0, 0, 0.08) 66%,
            transparent 100%
          );
        }

        .hero-status {
          position: relative;
          display: grid;
          width: 8px;
          height: 8px;
          place-items: center;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .hero-status span {
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.74);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.28);
        }

        .hero-title-stage {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .hero-title {
          margin: 0;
          white-space: nowrap;
          letter-spacing: -0.055em;
          transform-origin: 50% 60%;
          text-shadow: 0 18px 55px rgba(0, 0, 0, 0.26);
          will-change: transform, letter-spacing, text-shadow, filter;

          transition:
            transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
            letter-spacing 560ms cubic-bezier(0.22, 1, 0.36, 1),
            text-shadow 560ms ease,
            filter 560ms ease;
        }

        .hero-title-hover-sheen {
          opacity: 0;
          transform: translateX(-115%);
          background: linear-gradient(
            105deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.02) 43%,
            rgba(255, 255, 255, 0.14) 50%,
            rgba(255, 255, 255, 0.025) 57%,
            transparent 65%,
            transparent 100%
          );

          -webkit-mask-image: linear-gradient(#000, #000);
          mask-image: linear-gradient(#000, #000);

          mix-blend-mode: screen;

          transition:
            opacity 260ms ease,
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-title-mask::after {
          content: "";
          position: absolute;
          inset: -14% -8%;
          z-index: -1;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(
            160px circle at var(--title-x) var(--title-y),
            rgba(255, 255, 255, 0.07),
            transparent 72%
          );
          transition: opacity 320ms ease;
        }

        .hero-title-stage:hover .hero-title-mask::after {
          opacity: 1;
        }

        .hero-title-stage:hover .hero-title {
          transform: translateY(-1px) scaleX(1.012);
          letter-spacing: -0.048em;
          text-shadow:
            0 20px 58px rgba(0, 0, 0, 0.28),
            0 0 20px rgba(255, 255, 255, 0.035);
          filter: brightness(1.035);
        }

        .hero-title-stage:hover .hero-title-hover-sheen {
          opacity: 0.85;
          transform: translateX(115%);
        }

        .hero-title-rule {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.52),
            rgba(255, 255, 255, 0.09) 58%,
            transparent
          );

          opacity: 0.72;
          transition:
            opacity 420ms ease,
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-title-stage:hover .hero-title-rule {
          opacity: 1;
          transform: scaleX(1.035);
        }

        .hero-role-separator {
          width: 24px;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
          transition: width 350ms cubic-bezier(0.22, 1, 0.36, 1), background 350ms ease;
        }

        .hero-role:hover .hero-role-separator {
          width: 34px;
          background: rgba(255, 255, 255, 0.4);
        }

        .hero-summary {
          position: relative;
          padding-left: 18px;
        }

        .hero-summary::before {
          content: "";
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.52),
            rgba(255, 255, 255, 0.06)
          );
          transform-origin: top;
          transition: transform 350ms ease, opacity 350ms ease;
        }

        .hero-summary:hover::before {
          transform: scaleY(1.08);
          opacity: 0.85;
        }

        .hero-primary,
        .hero-location {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(10px);
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 300ms ease,
            background 300ms ease,
            box-shadow 300ms ease;
        }

        .hero-primary {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .hero-primary:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        }

        .hero-location:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.16);
        }

        @media (hover: none), (pointer: coarse) {
          .hero-title-stage:hover .hero-title {
            transform: none;
            letter-spacing: -0.055em;
            filter: none;
          }

          .hero-title-hover-sheen {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .hero-grid {
            opacity: 0.42;
          }

          .hero-readability {
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.82),
              rgba(0, 0, 0, 0.58) 62%,
              rgba(0, 0, 0, 0.3)
            );
          }

          .hero-network {
            opacity: 0.45 !important;
            mask-image: linear-gradient(to bottom, transparent 2%, black 25%, black 82%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 2%, black 25%, black 82%, transparent 100%);
          }

          .hero-ambient-glow {
            right: -34%;
            top: 23%;
            width: 88vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-title,
          .hero-title-hover-sheen,
          .hero-role-separator,
          .hero-summary::before,
          .hero-primary,
          .hero-location {
            transition: none;
          }

          .hero-cursor-dot,
          .hero-scan,
          .hero-orbit,
          .hero-orbit-dot {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}


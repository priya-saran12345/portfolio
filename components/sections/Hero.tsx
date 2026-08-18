"use client";

import dynamic from "next/dynamic";
import { profile } from "@/lib/data";
import { MapPin } from "lucide-react";
const StackNetwork = dynamic(
  () => import("@/components/three/StackNetwork"),
  { ssr: false }
);
export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-base"
    >
      {/* ================================================= */}
      {/* BACKGROUND GRID */}
      {/* ================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-grid-pattern
          bg-[length:44px_44px]

          opacity-60

          [mask-image:radial-gradient(
            ellipse_at_center,
            black_10%,
            transparent_70%
          )]
        "
      />

      {/* ================================================= */}
      {/* INTERACTIVE THREE.JS NETWORK */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0
          z-[2]

          md:pointer-events-auto
          md:inset-y-0
          md:left-[40%]
          md:right-[-7%]

          lg:left-[43%]
          lg:right-[-4%]

          cursor-grab
          active:cursor-grabbing
        "
      >
        <StackNetwork />
      </div>

      {/* ================================================= */}
      {/* LEFT READABILITY FADE */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0
          z-[3]

          bg-gradient-to-r
          from-base
          via-base/75
          to-transparent

          md:via-base/55
        "
      />

      {/* ================================================= */}
      {/* HERO CONTENT */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none

          relative
          z-10

          max-w-[90%]
          xl:w-[98%]

          mx-auto
          px-6

          min-h-screen

          flex
          flex-col
          justify-center

          pt-24
          pb-16
        "
      >
        {/* ROLE LABEL */}

        <p
          className="
            mb-5
            animate-fade-up
          "
          style={{
            animationDelay: "0ms",
          }}
        >
          Full-Stack Developer ...
        </p>

        {/* ================================================= */}
        {/* LIQUID / WATER NAME */}
        {/* ================================================= */}

        <div
          className="
            water-wrapper
            pointer-events-auto

            relative
            inline-block
            w-fit

            group
            cursor-default
          "
        >
          {/* ORIGINAL NAME */}

          <h1
            className="
              relative
              z-10

              font-display
              font-semibold

              leading-[1.02]

              text-[13vw]
              sm:text-6xl
              md:text-7xl

              text-ink

              animate-fade-up

              transition-opacity
              duration-300

              group-hover:opacity-0

              select-none
            "
            style={{
              animationDelay: "80ms",
            }}
          >
            {profile.name}
          </h1>

          {/* =============================================== */}
          {/* WATER TEXT */}
          {/* =============================================== */}

          <h1
            aria-hidden="true"
            className="
              water-name

              absolute
              inset-0
              z-20

              pointer-events-none

              font-display
              font-semibold

              leading-[1.02]

              text-[13vw]
              sm:text-6xl
              md:text-7xl

              opacity-0

              transition-opacity
              duration-300

              group-hover:opacity-100

              select-none
            "
          >
            {profile.name}
          </h1>

          {/* =============================================== */}
          {/* SECOND WATER REFLECTION INSIDE TEXT */}
          {/* =============================================== */}

          <h1
            aria-hidden="true"
            className="
              water-highlight

              absolute
              inset-0
              z-[21]

              pointer-events-none

              font-display
              font-semibold

              leading-[1.02]

              text-[13vw]
              sm:text-6xl
              md:text-7xl

              opacity-0

              group-hover:opacity-100

              transition-opacity
              duration-500

              select-none
            "
          >
            {profile.name}
          </h1>

          {/* =============================================== */}
          {/* WATER LINE BELOW NAME */}
          {/* =============================================== */}

          <div
            className="
              water-line

              pointer-events-none

              absolute
              -bottom-2
              left-0

              z-20

              h-px
              w-0

              opacity-0

              bg-gradient-to-r
              from-transparent
              via-cyan-300
              to-transparent

              group-hover:w-full
              group-hover:opacity-100

              transition-all
              duration-700

              shadow-[0_0_15px_rgba(103,232,249,0.55)]
            "
          />

          {/* SMALL GLOW UNDER NAME */}

          <div
            className="
              pointer-events-none

              absolute
              left-1/2
              bottom-0

              z-0

              h-10
              w-[80%]

              -translate-x-1/2

              rounded-full

              bg-cyan-400/[0.08]

              blur-2xl

              opacity-0

              group-hover:opacity-100

              transition-opacity
              duration-700
            "
          />

          {/* ================================================= */}
          {/* WATER CSS */}
          {/* ================================================= */}

          <style jsx>{`
            .water-name {
              color: transparent;

              background-image: linear-gradient(
                110deg,
                #ffffff 0%,
                #d9fbff 8%,
                #9cf4ff 18%,
                #38d9ff 30%,
                #0ea5e9 40%,
                #ffffff 50%,
                #67e8f9 62%,
                #0284c7 72%,
                #a5f3fc 84%,
                #ffffff 100%
              );

              background-size: 320% 100%;

              -webkit-background-clip: text;
              background-clip: text;

              -webkit-text-fill-color: transparent;

              filter: drop-shadow(
                0 0 7px rgba(103, 232, 249, 0.2)
              );
            }

            .water-highlight {
              color: transparent;

              background-image: linear-gradient(
                180deg,
                transparent 0%,
                transparent 35%,
                rgba(255, 255, 255, 0.8) 47%,
                rgba(103, 232, 249, 0.7) 52%,
                transparent 61%,
                transparent 100%
              );

              background-size: 100% 220%;

              -webkit-background-clip: text;
              background-clip: text;

              -webkit-text-fill-color: transparent;

              mix-blend-mode: screen;
            }

            .water-wrapper:hover .water-name {
              animation:
                waterFlow 2.2s linear infinite,
                waterMove 1.8s ease-in-out infinite;
            }

            .water-wrapper:hover .water-highlight {
              animation: waterReflection 2.2s ease-in-out infinite;
            }

            .water-wrapper:hover .water-line {
              animation: lineWave 2s ease-in-out infinite;
            }

            @keyframes waterFlow {
              0% {
                background-position: 220% center;
              }

              100% {
                background-position: -100% center;
              }
            }

            @keyframes waterMove {
              0%,
              100% {
                transform:
                  translateY(0px)
                  skewX(0deg)
                  scaleY(1);

                filter: drop-shadow(
                  0 0 6px rgba(103, 232, 249, 0.18)
                );
              }

              20% {
                transform:
                  translateY(-1px)
                  skewX(-0.4deg)
                  scaleY(1.006);
              }

              40% {
                transform:
                  translateY(1px)
                  skewX(0.4deg)
                  scaleY(0.995);
              }

              60% {
                transform:
                  translateY(-1px)
                  skewX(-0.3deg)
                  scaleY(1.006);

                filter: drop-shadow(
                  0 0 14px rgba(56, 189, 248, 0.4)
                );
              }

              80% {
                transform:
                  translateY(1px)
                  skewX(0.3deg)
                  scaleY(0.997);
              }
            }

            @keyframes waterReflection {
              0% {
                background-position: center 180%;
                opacity: 0.15;
              }

              45% {
                opacity: 0.85;
              }

              100% {
                background-position: center -100%;
                opacity: 0.15;
              }
            }

            @keyframes lineWave {
              0%,
              100% {
                transform: scaleX(0.96);
                opacity: 0.45;
              }

              50% {
                transform: scaleX(1.02);
                opacity: 1;
              }
            }
          `}</style>
        </div>

        {/* ================================================= */}
        {/* ROLE */}
        {/* ================================================= */}

        <p
          className="
            mt-6

            max-w-md
            md:max-w-lg

            text-muted

            text-base
            md:text-lg

            font-mono

            animate-fade-up
          "
          style={{
            animationDelay: "160ms",
          }}
        >
          {profile.role}

          <span className="text-teal">
            {" "}
            /{" "}
          </span>

          {profile.roleSecondary}
        </p>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <p
          className="
            mt-6

            max-w-xl

            text-ink/80

            leading-relaxed

            animate-fade-up
          "
          style={{
            animationDelay: "220ms",
          }}
        >
          {profile.summary}
        </p>

        {/* ================================================= */}
        {/* LOCATION */}
        {/* ================================================= */}

        <div
          className="
            mt-5

            flex
            items-center
            gap-2

            text-xs
            text-muted

            font-mono

            animate-fade-up
          "
          style={{
            animationDelay: "360ms",
          }}
        >
          <MapPin
            size={14}
            className="text-teal"
          />

          {profile.location}
        </div>
      </div>
    </section>
  );
}
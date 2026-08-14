"use client";

import dynamic from "next/dynamic";
import { profile } from "@/lib/data";
import { ArrowDown, MapPin } from "lucide-react";

const StackNetwork = dynamic(() => import("@/components/three/StackNetwork"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-base">
      {/* background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

      {/* 3D signature piece */}
      <div className="absolute inset-0 md:inset-y-0 md:right-[-6%] md:left-[38%] cursor-grab active:cursor-grabbing">
        <StackNetwork />
      </div>

      <div className="relative z-10 max-w-[90%] xl:w-[98%] mx-auto px-6 min-h-screen flex flex-col justify-center pt-24 pb-16">
        <p className="section-label mb-5 animate-fade-up"
         style={{ animationDelay: "0ms" }}>
          Full-Stack Developer ...
        </p>

        <h1
          className="font-display font-semibold leading-[1.02] text-[13vw] sm:text-6xl md:text-7xl text-ink animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {profile.name}
          <br />
          {/* <span className="text-gradient">{profile.name.split(" ")[1]}</span> */}
        </h1>

        <p
          className="mt-6 max-w-md md:max-w-lg text-muted text-base md:text-lg font-mono animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          {profile.role} <span className="text-teal">/</span> {profile.roleSecondary}
        </p>

        <p
          className="mt-6 max-w-xl text-ink/80 leading-relaxed animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          {profile.summary}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <a
            href="#contact"
            className="bg-teal text-base font-semibold text-sm px-6 py-3 rounded hover:bg-teal/90 transition-colors"
          >
            Start a project
          </a>
          <a
            href="#experience"
            className="border border-border text-ink text-sm px-6 py-3 rounded hover:border-ink/30 transition-colors"
          >
            View experience
          </a>
        </div>

        <div
          className="mt-10 flex items-center gap-2 text-xs text-muted font-mono animate-fade-up"
          style={{ animationDelay: "360ms" }}
        >
          <MapPin size={14} className="text-teal" />
          {profile.location}
        </div>
      </div>

      <a
        href="#skills"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-muted hover:text-ink transition-colors"
        aria-label="Scroll to skills"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}

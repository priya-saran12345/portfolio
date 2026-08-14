"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";
import SkillHeading3D from "@/components/three/SkillHeading3D";

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-base border-t border-border py-16 md:py-24"
    >
      {/* ============================= */}
      {/* MOVING BACKGROUND GRID */}
      {/* ============================= */}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100, 116, 139, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 116, 139, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPosition: [
            "0px 0px",
            "40px 40px",
          ],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* OPTIONAL SOFT FADE OVER GRID */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-gradient-to-b
          from-base/40
          via-transparent
          to-base/70
        "
      />

      {/* ============================= */}
      {/* CONTENT */}
      {/* ============================= */}

      <div className="relative z-10 max-w-[90%] xl:w-[98%] mx-auto px-6">

        {/* HEADING */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">

          <div className="flex flex-col items-center">
            <p className="section-label mb-2 text-center">
              01 — Toolkit
            </p>

            <div
              className="
                w-[220px]
                sm:w-[270px]
                md:w-[340px]
                h-[0px]
                md:h-[95px]
                -mb-1
              "
            >
              <SkillHeading3D text="Skills" />
            </div>
          </div>

          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed text-center">
            The stack I reach for when turning a requirement into a shipped,
            maintained feature — front end through to database and deploy.
          </p>
        </div>

        {/* ============================= */}
        {/* SKILLS GRID */}
        {/* ============================= */}

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">

          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
              }}
              className="
                border-b
                border-mono
                border-border
                pb-8
              "
            >

              <h3
                className="
                  font-mono
                  text-xs
                  tracking-widest
                  uppercase
                  text-teal
                  mb-4
                "
              >
                {group.label}
              </h3>

              <div className="flex flex-wrap gap-2">

                {group.items.map((item) => (
                  <span
                    key={item}
                    className="
                      text-sm
                      text-ink/85
                      bg-surface
                      border
                      border-border
                      rounded-full
                      px-3
                      py-1.5

                      hover:border-teal/40
                      hover:text-teal

                      transition-colors
                    "
                  >
                    {item}
                  </span>
                ))}

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
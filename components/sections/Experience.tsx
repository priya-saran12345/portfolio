"use client";

import { motion } from "framer-motion";
import {
  experience,
  education,
  certifications,
} from "@/lib/data";

import EarthGlobe from "@/components/three/EarthGlobe";

export default function Experience() {
  return (
    <section
      id="experience"
      className="
        relative
        isolate
        overflow-hidden
        border-t
        border-border
        py-24
        md:py-32
      "
    >
      {/* =========================================
          THREE.JS EARTH BACKGROUND
      ========================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
<div
  className="
    pointer-events-auto
    absolute
    left-[20%]
    top-[48%]
    h-[720px]
    w-[720px]
    -translate-y-1/2

    md:h-[560px]
    md:w-[560px]

    xl:right-[1%]
    xl:h-[780px]
    xl:w-[780px]

    cursor-grab
    active:cursor-grabbing
  "
>
  <EarthGlobe />
</div>      </div>

      {/* =========================================
          READABILITY OVERLAYS
          Strong on the left, open on the right
          so the globe stays visible.
      ========================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-base
          via-base/80
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-base/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-[2]
          h-24
          bg-gradient-to-b
          from-base/70
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]
          h-24
          bg-gradient-to-t
          from-base/70
          to-transparent
        "
      />

      {/* =========================================
          CONTENT
      ========================================== */}
<div
  className="
    relative
    z-10
    pointer-events-none
    max-w-[90%]
    xl:w-[98%]
    mx-auto
    px-6
  "
>        {/* Heading */}
        <div className="mb-16">
          <p className="section-label mb-3">
            03 — Track record
          </p>

          <h2
            className="
              font-display
              text-3xl
              md:text-5xl
              font-semibold
              text-ink
            "
          >
            Experience
          </h2>
        </div>

        <div
          className="
            grid
            lg:grid-cols-[1fr_320px]
            gap-16
          "
        >
          {/* =====================================
              TIMELINE
          ====================================== */}
          <div className="relative">
            {/* vertical timeline */}
            <div
              className="
                absolute
                left-[7px]
                top-2
                bottom-2
                w-px
                bg-border
              "
            />

            <div className="flex flex-col gap-14">
              {experience.map((job, i) => (
                <motion.div
                  key={job.company}
                  initial={{
                    opacity: 0,
                    x: -16,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-80px",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                  }}
                  className="
                    relative
                    pl-8
                  "
                >
                  {/* Timeline circle */}
                  <span
                    className={`
                      absolute
                      left-0
                      top-1.5
                      w-[15px]
                      h-[15px]
                      rounded-full
                      border-2
                      ${
                        i === 0
                          ? "bg-teal border-teal shadow-[0_0_14px_rgba(45,212,191,0.6)]"
                          : "bg-base border-muted"
                      }
                    `}
                  />

                  <p
                    className="
                      font-mono
                      text-xs
                      text-teal
                      mb-1.5
                    "
                  >
                    {job.period}
                  </p>

                  <h3
                    className="
                      font-display
                      text-xl
                      font-semibold
                      text-ink
                    "
                  >
                    {job.role}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-muted
                      mb-3
                    "
                  >
                    {job.company}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {job.points.map(
                      (point, idx) => (
                        <li
                          key={idx}
                          className="
                            text-sm
                            text-ink/75
                            leading-relaxed
                            flex
                            gap-2
                          "
                        >
                          <span
                            className="
                              text-teal
                              mt-1.5
                              shrink-0
                            "
                          >
                            ▸
                          </span>

                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* =====================================
              SIDEBAR
          ====================================== */}
          <div
            className="
              flex
              flex-col
              gap-10
            "
          >
            {/* ===============================
                EDUCATION
            ================================ */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                rounded-2xl
                border
                border-border
                bg-base/45
                backdrop-blur-md
                p-5
              "
            >
              <h3
                className="
                  font-mono
                  text-xs
                  tracking-widest
                  uppercase
                  text-teal
                  mb-5
                "
              >
                Education
              </h3>

              <div className="flex flex-col gap-6">
                {education.map((ed) => (
                  <div
                    key={ed.degree}
                    className="
                      border-l
                      border-border
                      pl-4
                    "
                  >
                    <p
                      className="
                        font-mono
                        text-xs
                        text-muted
                        mb-1
                      "
                    >
                      {ed.period}
                    </p>

                    <p
                      className="
                        text-sm
                        font-medium
                        text-ink
                      "
                    >
                      {ed.degree}
                    </p>

                    <p
                      className="
                        text-sm
                        text-muted
                      "
                    >
                      {ed.school}
                    </p>

                    {ed.notes.length > 0 && (
                      <ul
                        className="
                          mt-2
                          flex
                          flex-col
                          gap-1
                        "
                      >
                        {ed.notes.map((note) => (
                          <li
                            key={note}
                            className="
                              text-xs
                              text-ink/60
                            "
                          >
                            • {note}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ===============================
                CERTIFICATIONS
            ================================ */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="
                rounded-2xl
                border
                border-border
                bg-base/45
                backdrop-blur-md
                p-5
              "
            >
              <h3
                className="
                  font-mono
                  text-xs
                  tracking-widest
                  uppercase
                  text-teal
                  mb-5
                "
              >
                Certifications
              </h3>

              <ul className="flex flex-col gap-2">
                {certifications.map((certification) => (
                  <li
                    key={certification}
                    className="
                      text-xs
                      text-ink/70
                      leading-relaxed
                      border-b
                      border-border
                      pb-2
                    "
                  >
                    {certification}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

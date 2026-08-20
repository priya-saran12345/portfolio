"use client";

import { motion } from "framer-motion";
import {
  experience,
  education,
  certifications,
} from "@/lib/data";
import CertificateList from "@/components/sections/CertificateList";
import EarthGlobe from "@/components/three/EarthGlobe";


function CardEffects() {
  return (
    <>
      {/* Subtle grid */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-40
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Moving glow */}
      <motion.div
        className="
          absolute
          -top-20
          -right-20
          h-48
          w-48
          rounded-full
          bg-teal/10
          blur-[70px]
          pointer-events-none
        "
        animate={{
          x: [-16, 16, -16],
          y: [-8, 16, -8],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top scan line */}
      <motion.div
        className="
          absolute
          top-0
          left-0
          z-20
          h-px
          w-[45%]
          bg-gradient-to-r
          from-transparent
          via-teal
          to-transparent
          pointer-events-none
        "
        animate={{
          x: ["-100%", "320%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1,
        }}
      />

      {/* Corner accents */}
      <div
        className="
          absolute
          left-3
          top-3
          z-20
          w-4
          h-4
          border-l
          border-t
          border-teal/50
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          right-3
          bottom-3
          z-20
          w-4
          h-4
          border-r
          border-b
          border-teal/50
          pointer-events-none
        "
      />
    </>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="
        relative
        isolate
        overflow-hidden
        border-border
        py-14
        md:py-22
      "
    >
      {/* =========================================
          3D LAPTOP BACKGROUND
          Positioned on the RIGHT so it does not sit
          behind the Experience timeline text.
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
            absolute
            right-[-8%]
            top-[50%]
            h-[390px]
            w-[390px]
            -translate-y-1/2

            sm:right-[-5%]
            sm:h-[440px]
            sm:w-[440px]

            md:right-[-2%]
            md:h-[500px]
            md:w-[500px]

            lg:right-[0%]
            lg:h-[560px]
            lg:w-[560px]

            xl:right-[2%]
            xl:h-[620px]
            xl:w-[620px]

            2xl:right-[4%]
            2xl:h-[660px]
            2xl:w-[660px]
          "
        >
          <EarthGlobe />
        </div>
      </div>

      {/* =========================================
          READABILITY OVERLAYS

          Left side stays dark for Experience text.
          Right side remains open so the laptop is
          clearly visible.
      ========================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-base
          from-[0%]
          via-base/95
          via-[46%]
          to-base/15
        "
      />

      {/* Very light right-side veil only */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-[1]
          w-[42%]
          bg-gradient-to-l
          from-transparent
          to-base/5
        "
      />

      {/* Top fade */}
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

      {/* Bottom fade */}
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
>
        {/* Heading */}
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
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-base/45
                backdrop-blur-md
                p-5
              "
            >
              <CardEffects />

              <div className="relative z-10">
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
    flex
    items-start
    gap-2
    text-xs
    text-ink/60
    leading-5
  "
>
  <span
    className="
      mt-[7px]
      h-1
      w-1
      shrink-0
      rounded-full
      bg-current
      opacity-70
    "
  />
  <span className="flex-1">
    {note}
  </span>
</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
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
    relative
    overflow-hidden
    rounded-2xl
    pointer-events-auto
  "
>
  <CardEffects />

  <div className="relative z-10">
    <CertificateList
      certifications={certifications}
    />
  </div>
</motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

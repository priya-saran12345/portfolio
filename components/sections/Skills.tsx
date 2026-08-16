"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";
import SkillHeading3D from "@/components/three/SkillHeading3D";

export default function Skills() {
  return (
    <section
      id="skills"
      className="
        relative
        overflow-hidden
        bg-base
          border-border
        py-10
        md:py-14
      "
    >
      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.045),transparent_35%)]
        "
      />

      {/* Vertical decorative lines */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-0 h-full w-px bg-white/[0.025]" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.025]" />
        <div className="absolute right-[8%] top-0 h-full w-px bg-white/[0.025]" />
      </div> */}

      {/* Floating background text */}
      <motion.div
        className="
          absolute
          top-24
          left-1/2
          -translate-x-1/2
          text-[120px]
          md:text-[220px]
          lg:text-[300px]
          font-black
          tracking-tighter
          text-white/[0.015]
          select-none
          pointer-events-none
          whitespace-nowrap
        "
        animate={{
          x: ["-52%", "-48%", "-52%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        SKILLS
      </motion.div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10   max-w-[90%]
          xl:w-[98%]
 mx-auto px-6 lg:px-10">
        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              font-mono
              text-[10px]
              md:text-xs
              tracking-[0.35em]
              uppercase
              text-muted
              mb-2
            "
          >
            01 — Toolkit
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              w-[220px]
              sm:w-[270px]
              md:w-[340px]
              h-[0px]
              md:h-[95px]
            "
          >
            <SkillHeading3D text="Skills" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              max-w-xl
              mt-4
              text-sm
              md:text-[15px]
              leading-7
              text-muted
            "
          >
            Technologies I use to turn ideas into fast, scalable and
            production-ready products.
          </motion.p>
        </div>

        {/* ================================================= */}
        {/* SKILL ROWS */}
        {/* ================================================= */}

        <div className="border-t border-white/[0.08]">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.label}
              initial={{
                opacity: 0,
                y: 35,
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
                duration: 0.65,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                group
                relative
                border-b
                border-white/[0.08]
                overflow-hidden
              "
            >
              {/* ================================================= */}
              {/* HOVER BACKGROUND */}
              {/* ================================================= */}

              <div
                className="
                  absolute
                  inset-0
                  bg-white/[0.025]

                  translate-x-[-101%]
                  group-hover:translate-x-0

                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                "
              />

              {/* moving light */}
              <div
                className="
                  absolute
                  -left-[20%]
                  top-1/2
                  -translate-y-1/2

                  w-[300px]
                  h-[180px]

                  rounded-full
                  bg-white/[0.035]
                  blur-[70px]

                  opacity-0
                  group-hover:opacity-100
                  group-hover:left-[75%]

                  transition-all
                  duration-1000

                  pointer-events-none
                "
              />

              {/* ================================================= */}
              {/* ROW CONTENT */}
              {/* ================================================= */}

              <div
                className="
                  relative
                  z-10

                  grid
                  grid-cols-[45px_1fr]
                  md:grid-cols-[70px_260px_1fr]

                  gap-3
                  md:gap-8

                  items-start
                  md:items-center

                  py-7
                  md:py-9

                  transition-all
                  duration-500

                  group-hover:px-3
                "
              >
                {/* NUMBER */}

                <span
                  className="
                    font-mono
                    text-[10px]
                    text-white/25

                    pt-1
                    md:pt-0

                    transition-all
                    duration-300

                    group-hover:text-white/60
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* CATEGORY */}

                <div>
                  <motion.h3
                    className="
                      text-lg
                      sm:text-xl
                      lg:text-2xl

                      font-medium

                      text-ink

                      tracking-tight

                      transition-transform
                      duration-500

                      group-hover:translate-x-2
                    "
                  >
                    {group.label}
                  </motion.h3>

                  {/* small mobile line */}

                  <div
                    className="
                      md:hidden
                      mt-3
                      h-px
                      w-6
                      bg-white/20

                      transition-all
                      duration-500

                      group-hover:w-12
                    "
                  />
                </div>

                {/* SKILLS */}

                <div
                  className="
                    col-start-2
                    md:col-start-auto

                    flex
                    flex-wrap

                    gap-x-2
                    gap-y-2

                    md:justify-end
                  "
                >
                  {group.items.map((item, itemIndex) => (
                    <motion.span
                      key={item}
                      whileHover={{
                        y: -4,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="
                        relative

                        text-xs
                        sm:text-sm

                        text-ink/65

                        border
                        border-white/[0.08]

                        rounded-full

                        px-3
                        py-1.5

                        bg-black/10
                        backdrop-blur-sm

                        cursor-default

                        transition-all
                        duration-300

                        hover:text-ink
                        hover:border-white/[0.25]
                        hover:bg-white/[0.04]
                      "
                    >
                      {item}

                      {/* little hover dot */}

                      <span
                        className="
                          absolute
                          -top-1
                          -right-1

                          w-1.5
                          h-1.5

                          rounded-full
                          bg-white

                          scale-0
                          opacity-0

                          transition-all
                          duration-300

                          group-hover:opacity-100

                          hover:scale-100
                        "
                      />
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* ================================================= */}
              {/* BOTTOM PROGRESS LINE */}
              {/* ================================================= */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0

                  h-px
                  w-0

                  bg-white/60

                  group-hover:w-full

                  transition-all
                  duration-700
                  ease-out
                "
              />

              {/* ================================================= */}
              {/* LARGE NUMBER ON HOVER */}
              {/* ================================================= */}

              <span
                className="
                  absolute

                  -right-2
                  top-1/2
                  -translate-y-1/2

                  text-[100px]
                  md:text-[140px]

                  font-black
                  leading-none

                  text-white/[0.018]

                  opacity-0
                  scale-75

                  group-hover:opacity-100
                  group-hover:scale-100

                  transition-all
                  duration-700

                  pointer-events-none
                  select-none
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ================================================= */}
        {/* BOTTOM FOOTER */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
          }}
          className="
            flex
            items-center
            justify-between

            mt-8

            font-mono
            text-[9px]
            sm:text-[10px]

            uppercase
            tracking-[0.2em]

            text-muted/50
          "
        >
          <span>Design • Build • Ship</span>

          <span className="hidden sm:block">
            Always learning
          </span>
        </motion.div>
      </div>
    </section>
  );
}
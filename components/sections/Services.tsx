"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import SkillHeading3D from "../three/SkillHeading3D";
import ServicesCubeBackground from "../three/ServicesCubeBackground";
const accents = [
  {
    cube: "bg-cyan-400",
    glow: "bg-cyan-400/20",
    border: "hover:border-cyan-400/30",
    line: "bg-cyan-400",
  },
  {
    cube: "bg-violet-400",
    glow: "bg-violet-400/20",
    border: "hover:border-violet-400/30",
    line: "bg-violet-400",
  },
  {
    cube: "bg-amber-400",
    glow: "bg-amber-400/20",
    border: "hover:border-amber-400/30",
    line: "bg-amber-400",
  },
  {
    cube: "bg-emerald-400",
    glow: "bg-emerald-400/20",
    border: "hover:border-emerald-400/30",
    line: "bg-emerald-400",
  },
  {
    cube: "bg-rose-400",
    glow: "bg-rose-400/20",
    border: "hover:border-rose-400/30",
    line: "bg-rose-400",
  },
  {
    cube: "bg-blue-400",
    glow: "bg-blue-400/20",
    border: "hover:border-blue-400/30",
    line: "bg-blue-400",
  },
];

const cubeVariants = {
  rest: {
    opacity: 0.025,
    scale: 0.75,
  },

  hover: (delay: number) => ({
    opacity: [0.025, 0.5, 0.12],
    scale: [0.75, 1, 0.9],

    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut" as const,
    },
  }),
};

export default function Services() {
  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        border-border
        py-10
        md:py-16
      "
    >
      
      {/* ================================================= */}
      {/* BACKGROUND GRID */}
      {/* ================================================= */}

{/* ================================================= */}
{/* BACKGROUND GRID */}
{/* ================================================= */}

<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `
      linear-gradient(
        to right,
        rgba(104, 95, 95, 0.08) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgba(248, 244, 244, 0.08) 1px,
        transparent 1px
      )
    `,
    backgroundSize: "40px 40px",
  }}
/>
      {/* LARGE SOFT GLOW */}

      <motion.div
        className="
          absolute
          top-[20%]
          left-1/2
          -translate-x-1/2

          w-[700px]
          h-[500px]

          rounded-full
          bg-white/[0.025]
          blur-[130px]

          pointer-events-none
        "
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10 max-w-[90%] xl:w-[94%] mx-auto px-6">
        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mb-12
            md:mb-14

            flex
            flex-col
            justify-center
            items-center

            text-center
          "
        >
          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0.15em",
            }}
            whileInView={{
              opacity: 1,
              letterSpacing: "0.3em",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
            }}
            className="
              section-label
              mb-2
            "
          >
            02 — WHAT I DO
          </motion.p>

          <div
            className="
              w-[220px]
              sm:w-[270px]
              md:w-[340px]

              h-[70px]
              md:h-[95px]

              -mb-1
            "
          >
            <SkillHeading3D text="Services" />
          </div>

          {/* small animated separator */}

          <motion.div
            initial={{
              width: 0,
            }}
            whileInView={{
              width: 70,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.35,
              duration: 0.8,
            }}
            className="
              mt-4
              h-px
              bg-white/20
            "
          />
        </motion.div>

        {/* ================================================= */}
        {/* SERVICES GRID */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3

            gap-4
          "
        >
          {services.map((service, i) => {
            const accent = accents[i % accents.length];

            return (
              <motion.div
                key={service.title}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.97,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover="hover"
                className={`
                  group
                  relative
                  overflow-hidden

                  min-h-[250px]

                  rounded-2xl

                  border
                  border-white/[0.07]

                  bg-surface

                  p-7
                  md:p-8

                  cursor-default

                  transition-[border-color,background-color,box-shadow,transform]
                  duration-500

                  ${accent.border}

                  hover:bg-white/[0.025]

                  hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]
                `}
              >
                {/* ================================================= */}
                {/* CUBE / PIXEL ANIMATION */}
                {/* ================================================= */}

                <div
                  className="
                    absolute
                    -right-4
                    -bottom-4

                    w-[210px]
                    h-[160px]

                    grid
                    grid-cols-7
                    grid-rows-5

                    gap-[5px]

                    rotate-[-7deg]

                    pointer-events-none
                  "
                >
                  {Array.from({ length: 35 }).map((_, cubeIndex) => {
                    const cols = 7;

                    const row = Math.floor(cubeIndex / cols);
                    const col = cubeIndex % cols;

                    /*
                      Starts roughly from bottom-left
                      and travels towards top-right.
                    */

                    const delay =
                      ((4 - row) * 0.02 + col * 0.025);

                    return (
                      <motion.span
                        key={cubeIndex}
                        custom={delay}
                        variants={cubeVariants}
                        initial="rest"
                        className={`
                          block
                          rounded-[2px]
                          ${accent.cube}
                        `}
                      />
                    );
                  })}
                </div>

                {/* ================================================= */}
                {/* HOVER GLOW */}
                {/* ================================================= */}

                <motion.div
                  variants={{
                    hover: {
                      opacity: 1,
                      scale: 1.2,
                    },
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className={`
                    absolute
                    -right-24
                    -bottom-24

                    w-[260px]
                    h-[260px]

                    rounded-full

                    ${accent.glow}

                    blur-[80px]

                    pointer-events-none
                  `}
                />

                {/* ================================================= */}
                {/* LARGE BACKGROUND NUMBER */}
                {/* ================================================= */}

                <motion.span
                  variants={{
                    hover: {
                      opacity: 0.07,
                      x: -10,
                      scale: 1,
                    },
                  }}
                  initial={{
                    opacity: 0,
                    x: 20,
                    scale: 0.8,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="
                    absolute
                    right-5
                    top-3

                    text-[90px]
                    md:text-[110px]

                    font-black
                    leading-none

                    text-white

                    pointer-events-none
                    select-none
                  "
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>

                {/* ================================================= */}
                {/* TOP COLOR LINE */}
                {/* ================================================= */}

                <motion.div
                  variants={{
                    hover: {
                      width: "100%",
                    },
                  }}
                  initial={{
                    width: "36px",
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`
                    absolute
                    left-0
                    top-0

                    h-[2px]

                    ${accent.line}
                  `}
                />

                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div
                  className="
                    relative
                    z-20

                    h-full

                    flex
                    flex-col
                    justify-between
                  "
                >
                  <div>
                    {/* number */}

                    <div className="flex items-center gap-3">
                      <span
                        className="
                          font-mono
                          text-[10px]
                          tracking-[0.2em]
                          text-muted
                        "
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <motion.span
                        variants={{
                          hover: {
                            width: 35,
                          },
                        }}
                        initial={{
                          width: 14,
                        }}
                        transition={{
                          duration: 0.4,
                        }}
                        className={`
                          h-px
                          ${accent.line}
                          opacity-60
                        `}
                      />
                    </div>

                    {/* title */}

                    <motion.h3
                      variants={{
                        hover: {
                          x: 5,
                        },
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="
                        font-display

                        text-lg
                        md:text-xl

                        font-semibold

                        text-ink

                        mt-6
                        mb-3

                        tracking-tight
                      "
                    >
                      {service.title}
                    </motion.h3>

                    {/* description */}

                    <p
                      className="
                        max-w-[90%]

                        text-sm
                        text-muted

                        leading-6
                      "
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* ================================================= */}
                  {/* BOTTOM */}
                  {/* ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      mt-8
                    "
                  >
                    <span
                      className="
                        font-mono
                        text-[9px]

                        uppercase
                        tracking-[0.2em]

                        text-white/25
                      "
                    >
                      Explore
                    </span>

                    {/* ARROW */}

                    <motion.div
                      variants={{
                        hover: {
                          x: 5,
                          rotate: -45,
                        },
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="
                        flex
                        items-center
                        justify-center

                        w-8
                        h-8

                        rounded-full

                        border
                        border-white/[0.1]

                        text-white/40

                        group-hover:text-white/80
                        group-hover:border-white/[0.2]

                        transition-colors
                      "
                    >
                      →
                    </motion.div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* BOTTOM SCAN LINE */}
                {/* ================================================= */}

                <motion.div
                  variants={{
                    hover: {
                      x: ["-120%", "120%"],
                      opacity: [0, 0.4, 0],
                    },
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    bottom-0
                    left-0

                    w-[60%]
                    h-px

                    bg-gradient-to-r
                    from-transparent
                    via-white
                    to-transparent

                    opacity-0

                    pointer-events-none
                  "
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
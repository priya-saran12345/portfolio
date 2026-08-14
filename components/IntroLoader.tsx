"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

const words = [
  "WELCOME",
  "TO",
  "MY",
  "PORTFOLIO",
];

export default function IntroLoader() {
  const [progress, setProgress] =
    useState(0);

  const [showWelcome, setShowWelcome] =
    useState(false);

  const [visibleWords, setVisibleWords] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  /* =========================================
     LOCK PAGE SCROLL
  ========================================== */

  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* =========================================
     LOADING 0 → 100
  ========================================== */

  useEffect(() => {
    let current = 0;

    const interval =
      window.setInterval(() => {
        /*
         * Small random increments make the
         * loading counter feel more natural.
         */
        const increment =
          Math.floor(
            Math.random() * 5
          ) + 1;

        current = Math.min(
          current + increment,
          100
        );

        setProgress(current);

        if (current >= 100) {
          window.clearInterval(
            interval
          );

          window.setTimeout(() => {
            setShowWelcome(true);
          }, 300);
        }
      }, 35);

    return () =>
      window.clearInterval(interval);
  }, []);

  /* =========================================
     REVEAL WELCOME WORDS ONE BY ONE
  ========================================== */

  useEffect(() => {
    if (!showWelcome) return;

    let index = 0;

    const interval =
      window.setInterval(() => {
        index += 1;

        setVisibleWords(index);

        if (index >= words.length) {
          window.clearInterval(
            interval
          );

          window.setTimeout(() => {
            setFinished(true);

            document.body.style.overflow =
              "";
          }, 1000);
        }
      }, 320);

    return () =>
      window.clearInterval(interval);
  }, [showWelcome]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black
          "
        >
          {/* =====================================
              SUBTLE BACKGROUND GRID
          ====================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.07]
              [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
              [background-size:60px_60px]
            "
          />

          {/* =====================================
              LOADER
          ====================================== */}

          <AnimatePresence mode="wait">
            {!showWelcome ? (
              <motion.div
                key="loader"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  filter:
                    "blur(10px)",
                }}
                transition={{
                  duration: 0.5,
                }}
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                {/* Percentage */}

                <motion.div
                  className="
                    font-display
                    text-[80px]
                    sm:text-[110px]
                    md:text-[150px]
                    lg:text-[190px]
                    font-semibold
                    leading-none
                    tracking-[-0.06em]
                    text-white
                  "
                >
                  {progress}

                  <span
                    className="
                      ml-2
                      text-2xl
                      md:text-4xl
                      text-white/50
                    "
                  >
                    %
                  </span>
                </motion.div>

                {/* Loading label */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                  "
                >
                  <motion.span
                    animate={{
                      opacity: [
                        0.25,
                        1,
                        0.25,
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                    }}
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-white
                    "
                  />

                  <span
                    className="
                      font-mono
                      text-[10px]
                      md:text-xs
                      uppercase
                      tracking-[0.4em]
                      text-white/50
                    "
                  >
                    Loading experience
                  </span>
                </div>

                {/* Progress line */}

                <div
                  className="
                    mt-8
                    h-px
                    w-[220px]
                    sm:w-[320px]
                    overflow-hidden
                    bg-white/15
                  "
                >
                  <motion.div
                    className="
                      h-full
                      bg-white
                    "
                    animate={{
                      width:
                        `${progress}%`,
                    }}
                    transition={{
                      duration: 0.08,
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              /* =================================
                 WELCOME TEXT
              ================================== */

              <motion.div
                key="welcome"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-6
                "
              >
                <div
                  className="
                    flex
                    max-w-[1200px]
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-5
                    gap-y-0
                    md:gap-x-8
                    -rotate-3
                  "
                >
                  {words.map(
                    (word, index) => (
                      <AnimatePresence
                        key={word}
                      >
                        {index <
                          visibleWords && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              y: 100,
                              rotateX: -90,
                              filter:
                                "blur(15px)",
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              rotateX: 0,
                              filter:
                                "blur(0px)",
                            }}
                            transition={{
                              duration: 0.65,
                              ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                              ],
                            }}
                            className="
                              inline-block
                              font-display
                              text-[48px]
                              sm:text-[70px]
                              md:text-[95px]
                              lg:text-[125px]
                              xl:text-[145px]
                              font-black
                              uppercase
                              leading-[0.9]
                              tracking-[-0.06em]
                              text-white
                            "
                          >
                            {word}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )
                  )}
                </div>

                {/* Bottom line */}

                <motion.div
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX:
                      visibleWords ===
                      words.length
                        ? 1
                        : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15,
                  }}
                  className="
                    mt-10
                    h-px
                    w-[180px]
                    origin-center
                    bg-white/50
                  "
                />

                {/* Small text */}

                <AnimatePresence>
                  {visibleWords ===
                    words.length && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.3,
                      }}
                      className="
                        mt-5
                        font-mono
                        text-[10px]
                        uppercase
                        tracking-[0.45em]
                        text-white/40
                      "
                    >
                      Scroll to explore
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================
              DECORATIVE CORNERS
          ====================================== */}

          <div
            className="
              absolute
              left-6
              top-6
              font-mono
              text-[9px]
              uppercase
              tracking-[0.3em]
              text-white/25
            "
          >
            Portfolio / 2026
          </div>

          <div
            className="
              absolute
              bottom-6
              right-6
              font-mono
              text-[9px]
              uppercase
              tracking-[0.3em]
              text-white/25
            "
          >
            Full Stack Developer
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
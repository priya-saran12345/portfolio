import Navbar from "@/components/Navbar";

import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

import IntroLoader from "@/components/IntroLoader";
import ScrollCharacter from "@/components/three/ScrollCharacter";

export default function Home() {
  return (
    <main
      className="
        relative
        isolate
        min-h-screen
        overflow-x-hidden
        bg-base
      "
    >
      {/* =========================================
          INTRO LOADER
      ========================================== */}

      <div className="relative z-[100]">
        <IntroLoader />
      </div>

      {/* =========================================
          NAVBAR
      ========================================== */}

      <div className="relative z-[50]">
        <Navbar />
      </div>

      {/* =========================================
          HERO

          NO ROBOT HERE
      ========================================== */}

      <Hero />

      {/* =====================================================
          ROBOT AREA

          Robot exists ONLY while scrolling through:

          Skills
          Services
          Experience
      ====================================================== */}

      <div className="relative">

        {/* =====================================
            STICKY ROBOT BACKGROUND
        ====================================== */}

        <div
          className="
            pointer-events-none
            sticky
            top-0

            z-[10]

            h-screen
            w-full

            -mb-[100vh]

            overflow-hidden

            opacity-[0.18]
            md:opacity-[0.24]
          "
          aria-hidden="true"
        >
          <ScrollCharacter />
        </div>

        {/* =====================================
            SKILLS / SERVICES / EXPERIENCE

            ABOVE ROBOT
        ====================================== */}

        <div className="relative z-[20]">

          <Skills />

          <Services />

          <Experience />

        </div>
      </div>

      {/* =========================================
          CONTACT

          ROBOT ENDS BEFORE THIS SECTION
      ========================================== */}

      <Contact />
    </main>
  );
}
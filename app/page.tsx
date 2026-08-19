// import Navbar from "@/components/Navbar";

// import Hero from "@/components/sections/Hero";
// import Skills from "@/components/sections/Skills";
// import Services from "@/components/sections/Services";
// import Experience from "@/components/sections/Experience";
// import Contact from "@/components/sections/Contact";

// import IntroLoader from "@/components/IntroLoader";
// import ScrollCharacter from "@/components/three/ScrollCharacter";

// export default function Home() {
//   return (
//     <main
//       className="
//         relative
//         isolate
//         min-h-screen
//         overflow-x-hidden
//         bg-base
//       "
//     >
//       {/* =====================================================
//           GLOBAL SCROLL CHARACTER
//           Visible throughout the website
//           Behind actual content
//       ====================================================== */}
//       <div
//         className="
//           pointer-events-none
//           fixed
//           inset-0
//           z-[10]
//           overflow-hidden

//           opacity-[0.22]
//           md:opacity-[0.28]
//         "
//         aria-hidden="true"
//       >
//         <ScrollCharacter />
//       </div>

//       {/* =====================================================
//           INTRO LOADER
//       ====================================================== */}
//       <div className="relative z-[100]">
//         <IntroLoader />
//       </div>

//       {/* =====================================================
//           NAVBAR
//       ====================================================== */}
//       <div className="relative z-[50]">
//         <Navbar />
//       </div>

//       {/* =====================================================
//           PAGE CONTENT
//       ====================================================== */}
//       <div className="relative z-[20]">
//         <Hero />

//         <Skills />

//         <Services />

//         <Experience />

//         <Contact />
//       </div>
//     </main>
//   );
// }
import Navbar from "@/components/Navbar";

import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

import IntroLoader from "@/components/IntroLoader";

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
      {/* =====================================================
          INTRO LOADER
      ====================================================== */}
      <div className="relative z-[100]">
        <IntroLoader />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <div className="relative z-[50]">
        <Navbar />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}
      <div className="relative ">
        <Hero />

        <Skills />

        <Services />

        <Experience />

        <Contact />
      </div>
    </main>
  );
}
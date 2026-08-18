
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Github } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const goHome = () => {
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    router.push("/");
  };

  const goGitHub = () => {
    if (pathname === "/github") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    router.push("/github");
  };

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-border/20
        bg-base/15
        backdrop-blur-md
      "
    >
      <nav
        className="
          mx-auto
          flex
          h-[68px]
          max-w-[90%]
          px-6
          xl:w-[98%]
          items-center
          justify-between
        "
      >
        {/* HOME */}
        <button
          type="button"
          onClick={goHome}
          aria-label="Go to home"
          className="
            font-display
            text-sm
            font-semibold
            tracking-[0.08em]
            text-ink
            transition-opacity
            duration-300
            hover:opacity-75
          "
        >
          PRIYA
          <span className="text-indigo">
            .
          </span>
          SARAN
        </button>

        {/* GITHUB */}
        <button
          type="button"
          onClick={goGitHub}
          aria-label="Open GitHub page"
          className="
            group
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-transparent
            text-indigo
            outline-none
          "
        >
          {/* Growing circle */}
          <span
            className={`
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-indigo/35
              transition-all
              duration-500
              ease-out

              ${
                pathname === "/github"
                  ? "h-11 w-11 opacity-100"
                  : "h-4 w-4 opacity-0 group-hover:h-11 group-hover:w-11 group-hover:opacity-100"
              }
            `}
          />

          {/* Soft glow */}
          <span
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-5
              w-5
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-indigo/0
              blur-md
              transition-all
              duration-500
              group-hover:h-12
              group-hover:w-12
              group-hover:bg-indigo/10
            "
          />

          <Github
            size={20}
            strokeWidth={1.6}
            className="
              relative
              z-10
              text-indigo/80
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:text-indigo
            "
          />
        </button>
      </nav>
    </header>
  );
}



// "use client";

// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   usePathname,
//   useRouter,
// } from "next/navigation";

// import { navLinks } from "@/lib/data";

// import {
//   ChevronRight,
//   Menu,
//   PhoneCall,
//   X,
// } from "lucide-react";

// type NavItem = {
//   label: string;
//   href: string;
// };

// /*
//  * Logical navigation:
//  *
//  * Hash links belong to the HOME page.
//  * /github is a separate Next.js page.
//  */
// const navbarLinks: NavItem[] = [
//   {
//     label: "Home",
//     href: "#top",
//   },

//   ...navLinks.filter(
//     (link) =>
//       link.href !== "#top" &&
//       link.href !== "#contact"
//   ),

//   {
//     label: "Git Status",
//     href: "/github",
//   },

//   ...navLinks.filter(
//     (link) =>
//       link.href === "#contact"
//   ),
// ];

// export default function Navbar() {
//   const router =
//     useRouter();

//   const pathname =
//     usePathname();

//   const isHomePage =
//     pathname === "/";

//   const [
//     open,
//     setOpen,
//   ] = useState(false);

//   const [
//     scrolled,
//     setScrolled,
//   ] = useState(false);

//   const [
//     activeHref,
//     setActiveHref,
//   ] = useState(
//     pathname === "/github"
//       ? "/github"
//       : "#top"
//   );


//   const navigationTargetRef =
//     useRef<string | null>(
//       null
//     );

//   /* =========================================
//      BUILD THE REAL URL

//      Home section while already at /
//        #skills

//      Home section while at /github
//        /#skills

//      GitHub
//        /github
//   ========================================== */

//   const resolveHref = (
//     href: string
//   ) => {
//     if (
//       href.startsWith("#")
//     ) {
//       return isHomePage
//         ? href
//         : `/${href}`;
//     }

//     return href;
//   };

//   /* =========================================
//      PAGE-LEVEL ACTIVE STATE

//      /        -> home sections handled below
//      /github  -> Git Status
//   ========================================== */

//   useEffect(() => {
//     setOpen(false);

//     if (
//       pathname === "/github"
//     ) {
//       navigationTargetRef.current =
//         null;

//       setActiveHref(
//         "/github"
//       );

//       return;
//     }

//     if (
//       pathname === "/"
//     ) {
//       const currentHash =
//         window.location.hash;

//       const validHash =
//         currentHash &&
//         navbarLinks.some(
//           (link) =>
//             link.href ===
//             currentHash
//         );

//       setActiveHref(
//         validHash
//           ? currentHash
//           : "#top"
//       );
//     }
//   }, [pathname]);

//   /* =========================================
//      NAVBAR BACKGROUND + HOME TOP STATE
//   ========================================== */

//   useEffect(() => {
//     const onScroll = () => {
//       setScrolled(
//         window.scrollY > 12
//       );

//       /*
//        * Only calculate Home from scrolling
//        * when we are actually on the Home page.
//        */
//       if (!isHomePage) {
//         return;
//       }

//       if (
//         window.scrollY < 120 &&
//         navigationTargetRef.current ===
//           null
//       ) {
//         setActiveHref("#top");
//       }
//     };

//     onScroll();

//     window.addEventListener(
//       "scroll",
//       onScroll,
//       {
//         passive: true,
//       }
//     );

//     return () => {
//       window.removeEventListener(
//         "scroll",
//         onScroll
//       );
//     };
//   }, [isHomePage]);

//   /* =========================================
//      HOME SECTION OBSERVER

//      IMPORTANT:
//      Do not run it on /github because those
//      sections are not on that page.
//   ========================================== */

//   useEffect(() => {
//     if (!isHomePage) {
//       return;
//     }

//     const observedSections:
//       HTMLElement[] = [];

//     const observer =
//       new IntersectionObserver(
//         (entries) => {
//           const visibleEntries =
//             entries
//               .filter(
//                 (entry) =>
//                   entry.isIntersecting
//               )
//               .sort(
//                 (a, b) =>
//                   b.intersectionRatio -
//                   a.intersectionRatio
//               );

//           const bestEntry =
//             visibleEntries[0];

//           if (!bestEntry) {
//             return;
//           }

//           const sectionId =
//             bestEntry.target.id;

//           const href =
//             `#${sectionId}`;

//           const existsInNav =
//             navbarLinks.some(
//               (link) =>
//                 link.href ===
//                 href
//             );

//           if (!existsInNav) {
//             return;
//           }

//           if (
//             navigationTargetRef.current === href
//           ) {
//             navigationTargetRef.current = null;
//           }

//           setActiveHref(href);
//         },
//         {
//           root: null,
//           rootMargin:
//             "-30% 0px -50% 0px",
//           threshold: [
//             0.05,
//             0.2,
//             0.4,
//             0.6,
//           ],
//         }
//       );

//     navbarLinks.forEach(
//       (link) => {
//         if (
//           !link.href.startsWith(
//             "#"
//           )
//         ) {
//           return;
//         }

//         const id =
//           link.href.slice(1);

//         const section =
//           document.getElementById(
//             id
//           );

//         if (section) {
//           observer.observe(
//             section
//           );

//           observedSections.push(
//             section
//           );
//         }
//       }
//     );

//     return () => {
//       observedSections.forEach(
//         (section) => {
//           observer.unobserve(
//             section
//           );
//         }
//       );

//       observer.disconnect();
//     };
//   }, [isHomePage]);


//   /* =========================================
//      NAVIGATE

//      CASE 1:
//      Home hash -> Home hash
//        smooth scroll

//      CASE 2:
//      GitHub -> Home hash
//        router.push("/#skills")

//      CASE 3:
//      Home -> /github
//        router.push("/github")
//   ========================================== */

//   const navigateTo = (
//     event: React.MouseEvent<HTMLAnchorElement>,
//     href: string
//   ) => {
//     event.preventDefault();
//     setOpen(false);

//     /*
//      * Already on the same standalone page.
//      */
//     if (
//       href === "/github" &&
//       pathname === "/github"
//     ) {
//       setActiveHref("/github");

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });

//       return;
//     }

//     /*
//      * HOME SECTION
//      */
//     if (href.startsWith("#")) {
//       navigationTargetRef.current = href;

//       /*
//        * Already on Home:
//        * smooth-scroll without a page change.
//        */
//       if (isHomePage) {
//         const target =
//           document.querySelector(href);

//         if (target) {
//           target.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });

//           window.history.pushState(
//             null,
//             "",
//             href
//           );

//           return;
//         }
//       }

//       /*
//        * From another page, return to Home
//        * and open the requested section.
//        */
//       router.push(`/${href}`);
//       return;
//     }

//     /*
//      * INTERNAL NEXT.JS PAGE
//      */
//     if (href.startsWith("/")) {
//       navigationTargetRef.current = null;
//       router.push(href);
//       return;
//     }

//     /*
//      * EXTERNAL FALLBACK
//      */
//     navigationTargetRef.current = null;
//     window.location.href = href;
//   };

//   return (
//     <>
//       <header
//         className={`
//           fixed
//           top-0
//           inset-x-0
//           z-50
//           transition-colors
//           duration-300

//           ${
//             scrolled
//               ? "bg-base/85 backdrop-blur-md border-b border-border/70"
//               : "bg-transparent border-b border-border"
//           }
//         `}
//       >
//         <nav
//           className="
//             max-w-[90%]
//             xl:w-[98%]
//             mx-auto
//             flex
//             items-center
//             justify-between
//             px-6
//             py-4
//           "
//         >
//           {/* =====================================
//               LOGO
//           ====================================== */}

//           <a
//             href="/"
//             onClick={(
//               event
//             ) =>
//               navigateTo(
//                 event,
//                 "#top"
//               )
//             }
//             className="
//               font-display
//               font-semibold
//               text-sm
//               tracking-wide
//               text-ink
//             "
//           >
//             PRIYA
//             <span className="text-teal">
//               .
//             </span>
//             SARAN
//           </a>

//           {/* =====================================
//               DESKTOP
//           ====================================== */}

//           <ul
//             className="
//               hidden
//               md:flex
//               items-center
//               gap-8
//             "
//           >
//             {navbarLinks.map(
//               (link) => {
//                 const isActive =
//                   activeHref ===
//                   link.href;


//                 const browserHref =
//                   resolveHref(
//                     link.href
//                   );

//                 return (
//                   <li
//                     key={
//                       link.href
//                     }
//                     className="relative"
//                   >
//                     <a
//                       href={
//                         browserHref
//                       }
//                       onClick={(
//                         event
//                       ) =>
//                         navigateTo(
//                           event,
//                           link.href
//                         )
//                       }
//                       className={`
//                         group
//                         relative
//                         inline-block
//                         pb-2
//                         text-sm
//                         transition-colors
//                         duration-300
//                         font-mono
//                         tracking-wide

//                         ${
//                           isActive
//                             ? "text-teal"
//                             : "text-muted hover:text-teal"
//                         }
//                       `}
//                     >
//                       {
//                         link.label
//                       }

//                       {/* underline */}
//                       <span
//                         className={`
//                           pointer-events-none
//                           absolute
//                           left-0
//                           bottom-0
//                           h-[2px]
//                           rounded-full
//                           bg-teal
//                           transition-all
//                           duration-500
//                           ease-out

//                           ${
//                             isActive
//                               ? "w-full opacity-80"
//                               : "w-0 group-hover:w-full"
//                           }
//                         `}
//                       />

//                       {/* moving chevron */}
//                       <span
//                         className={`
//                           pointer-events-none
//                           absolute
//                           bottom-[-7px]
//                           z-10
//                           flex
//                           h-4
//                           w-4
//                           items-center
//                           justify-center
//                           rounded-full
//                           bg-base
//                           text-teal
//                           transition-all
//                           duration-500
//                           ease-out
//                           shadow-[0_0_6px_#2dd4bf,0_0_14px_rgba(45,212,191,0.8)]

//                           ${
//                             isActive
//                               ? "left-[calc(100%-7px)] opacity-100"
//                               : "left-[-5px] opacity-0 group-hover:left-[calc(100%-7px)] group-hover:opacity-100"
//                           }
//                         `}
//                       >
//                         <ChevronRight
//                           size={14}
//                           strokeWidth={
//                             3
//                           }
//                           className="
//                             drop-shadow-[0_0_4px_#2dd4bf]
//                           "
//                         />
//                       </span>
//                     </a>
//                   </li>
//                 );
//               }
//             )}
//           </ul>

//           {/* =====================================
//               LET'S TALK

//               On /github this resolves naturally
//               back to /#contact.
//           ====================================== */}

//           <a
//             href={
//               isHomePage
//                 ? "#contact"
//                 : "/#contact"
//             }
//             onClick={(
//               event
//             ) =>
//               navigateTo(
//                 event,
//                 "#contact"
//               )
//             }
//             className="
//               hidden
//               md:inline-flex
//               items-center
//               gap-2
//               border
//               border-teal/40
//               text-teal
//               text-sm
//               font-mono
//               px-4
//               py-2
//               rounded
//               hover:bg-teal/10
//               hover:border-teal
//               transition-all
//               duration-300
//             "
//           >
//             <span
//               className="
//                 relative
//                 flex
//                 h-5
//                 w-5
//                 items-center
//                 justify-center
//               "
//             >
//               <span
//                 className="
//                   absolute
//                   inset-0
//                   rounded-full
//                   bg-emerald-400/20
//                   animate-ping
//                 "
//               />

//               <PhoneCall
//                 size={15}
//                 strokeWidth={2}
//                 className="
//                   relative
//                   z-10
//                   text-emerald-400
//                   drop-shadow-[0_0_5px_rgba(52,211,153,0.75)]
//                 "
//               />
//             </span>

//             Let&apos;s talk
//           </a>

//           {/* =====================================
//               MOBILE TOGGLE
//           ====================================== */}

//           <button
//             type="button"
//             className="
//               md:hidden
//               text-ink
//             "
//             onClick={() =>
//               setOpen(
//                 (value) =>
//                   !value
//               )
//             }
//             aria-label={
//               open
//                 ? "Close menu"
//                 : "Open menu"
//             }
//             aria-expanded={
//               open
//             }
//           >
//             {open ? (
//               <X size={22} />
//             ) : (
//               <Menu
//                 size={22}
//               />
//             )}
//           </button>
//         </nav>

//         {/* =====================================
//             MOBILE MENU
//         ====================================== */}

//         {open && (
//           <div
//             className="
//               md:hidden
//               bg-base/95
//               backdrop-blur-md
//               border-b
//               border-border
//               px-6
//               pb-6
//             "
//           >
//             <ul
//               className="
//                 flex
//                 flex-col
//                 gap-4
//                 pt-2
//               "
//             >
//               {navbarLinks.map(
//                 (link) => {
//                   const isActive =
//                     activeHref ===
//                     link.href;

//                   return (
//                     <li
//                       key={
//                         link.href
//                       }
//                     >
//                       <a
//                         href={resolveHref(
//                           link.href
//                         )}
//                         onClick={(
//                           event
//                         ) =>
//                           navigateTo(
//                             event,
//                             link.href
//                           )
//                         }
//                         className={`
//                           group
//                           relative
//                           inline-block
//                           pb-2
//                           text-base
//                           font-mono
//                           transition-colors
//                           duration-300

//                           ${
//                             isActive
//                               ? "text-teal"
//                               : "text-ink hover:text-teal"
//                           }
//                         `}
//                       >
//                         {
//                           link.label
//                         }

//                         <span
//                           className={`
//                             pointer-events-none
//                             absolute
//                             left-0
//                             bottom-0
//                             h-[2px]
//                             rounded-full
//                             bg-teal
//                             transition-all
//                             duration-500

//                             ${
//                               isActive
//                                 ? "w-full"
//                                 : "w-0 group-hover:w-full"
//                             }
//                           `}
//                         />
//                       </a>
//                     </li>
//                   );
//                 }
//               )}

//               <li>
//                 <a
//                   href={
//                     isHomePage
//                       ? "#contact"
//                       : "/#contact"
//                   }
//                   onClick={(
//                     event
//                   ) =>
//                     navigateTo(
//                       event,
//                       "#contact"
//                     )
//                   }
//                   className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     mt-2
//                     border
//                     border-teal/40
//                     text-teal
//                     text-sm
//                     font-mono
//                     px-4
//                     py-2
//                     rounded
//                     hover:bg-teal/10
//                     hover:border-teal
//                     transition-all
//                     duration-300
//                   "
//                 >
//                   <span
//                     className="
//                       relative
//                       flex
//                       h-5
//                       w-5
//                       items-center
//                       justify-center
//                     "
//                   >
//                     <span
//                       className="
//                         absolute
//                         inset-0
//                         rounded-full
//                         bg-emerald-400/20
//                         animate-ping
//                       "
//                     />

//                     <PhoneCall
//                       size={15}
//                       strokeWidth={
//                         2
//                       }
//                       className="
//                         relative
//                         z-10
//                         text-emerald-400
//                       "
//                     />
//                   </span>

//                   Let&apos;s talk
//                 </a>
//               </li>
//             </ul>
//           </div>
//         )}
//       </header>

//     </>
//   );
// }

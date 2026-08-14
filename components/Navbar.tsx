"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/data";
import { Menu, X, PhoneCall, ChevronRight } from "lucide-react";

type MonkeyMessage = "Hi 👋" | "Bye bye 👋" | "";

const navbarLinks = [
  { label: "Home", href: "#top" },

  // Existing tabs except Home and Contact
  ...navLinks.filter(
    (link) => link.href !== "#top" && link.href !== "#contact"
  ),

  // New Git Status tab
  ...navLinks.filter((link) => link.href === "#contact"),
  { label: "Git Status", href: "/github" },

  // Keep Contact at the end
];

function MiniMonkey({ message }: { message: MonkeyMessage }) {
  if (!message) return null;

  return (
    <div
      className="
        pointer-events-none
        absolute
        left-1/2
        top-full
        z-[70]
        mt-2
        -translate-x-1/2
        animate-[monkeyPop_.28s_ease-out]
      "
    >
      <div className="flex flex-col items-center">
        {/* Speech bubble */}
        <div
          className="
            relative
            whitespace-nowrap
            rounded-full
            border border-teal/30
            bg-base/95
            px-2.5 py-1
            font-mono
            text-[10px]
            font-semibold
            text-teal
            shadow-[0_0_12px_rgba(45,212,191,0.18)]
            backdrop-blur-md
          "
        >
          {message}
          <span
            className="
              absolute
              left-1/2
              top-full
              h-1.5
              w-1.5
              -translate-x-1/2
              -translate-y-1
              rotate-45
              border-b
              border-r
              border-teal/30
              bg-base
            "
          />
        </div>

        {/* Small cute monkey */}
        <div
          className="
            relative
            mt-1
            h-9
            w-9
            animate-[monkeyBob_.55s_ease-in-out_infinite_alternate]
          "
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_4px_5px_rgba(0,0,0,0.35)]"
            aria-hidden="true"
          >
            <circle cx="17" cy="47" r="14" fill="#8b4f2b" />
            <circle cx="83" cy="47" r="14" fill="#8b4f2b" />
            <circle cx="17" cy="47" r="8" fill="#e8b27c" />
            <circle cx="83" cy="47" r="8" fill="#e8b27c" />

            <circle cx="50" cy="45" r="35" fill="#8b4f2b" />

            <ellipse cx="50" cy="56" rx="27" ry="24" fill="#f1c18c" />
            <ellipse cx="39" cy="42" rx="13" ry="15" fill="#f1c18c" />
            <ellipse cx="61" cy="42" rx="13" ry="15" fill="#f1c18c" />

            <circle cx="39" cy="44" r="3.4" fill="#1f1712" />
            <circle cx="61" cy="44" r="3.4" fill="#1f1712" />
            <circle cx="40" cy="43" r="1" fill="#ffffff" />
            <circle cx="62" cy="43" r="1" fill="#ffffff" />

            <ellipse cx="50" cy="56" rx="4" ry="3" fill="#6e3d24" />

            <path
              d="M40 64 Q50 72 60 64"
              fill="none"
              stroke="#6e3d24"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>

          {/* Waving hand */}
          <span
            className="
              absolute
              -right-2
              top-0
              origin-bottom-left
              text-[16px]
              leading-none
              animate-[monkeyWave_.3s_ease-in-out_infinite_alternate]
            "
          >
            👋
          </span>

          {/* Teal glow */}
          <span
            className="
              absolute
              -bottom-1
              left-1/2
              -z-10
              h-2
              w-7
              -translate-x-1/2
              rounded-full
              bg-teal/25
              blur-sm
            "
          />
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeHref, setActiveHref] = useState("#top");

  const [monkeyHref, setMonkeyHref] = useState<string>("");
  const [monkeyMessage, setMonkeyMessage] =
    useState<MonkeyMessage>("");

  const navigationTargetRef = useRef<string | null>(null);
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearMonkeyTimers = () => {
    if (greetingTimerRef.current) {
      clearTimeout(greetingTimerRef.current);
    }

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
  };

  const showMonkey = (
    href: string,
    message: MonkeyMessage,
    duration = 1000
  ) => {
    if (greetingTimerRef.current) {
      clearTimeout(greetingTimerRef.current);
    }

    setMonkeyHref(href);
    setMonkeyMessage(message);

    greetingTimerRef.current = setTimeout(() => {
      setMonkeyMessage("");
    }, duration);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);

      // Keep Home active while the page is at the top.
      if (window.scrollY < 120 && navigationTargetRef.current === null) {
        setActiveHref((previous) => {
          if (previous !== "#top") {
            showMonkey("#top", "Hi 👋", 900);
          }

          return "#top";
        });
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /*
   * Watch every portfolio section.
   * When a new section becomes active:
   *  - update active nav item
   *  - move monkey there
   *  - say "Hi 👋"
   */
  useEffect(() => {
    const observedSections: HTMLElement[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        const bestEntry = visibleEntries[0];

        if (!bestEntry) return;

        const sectionId = bestEntry.target.id;
        const href = `#${sectionId}`;

        const existsInNav = navbarLinks.some(
          (link) => link.href === href
        );

        if (!existsInNav) return;

        setActiveHref((previous) => {
          if (previous === href) return previous;

          /*
           * During navbar navigation we only greet when
           * the requested target section is reached.
           */
          if (navigationTargetRef.current) {
            if (navigationTargetRef.current === href) {
              navigationTargetRef.current = null;
              showMonkey(href, "Hi 👋", 1250);
            }
          } else {
            /*
             * Manual mouse / trackpad scrolling:
             * greet the new section automatically.
             */
            showMonkey(href, "Hi 👋", 900);
          }

          return href;
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0.05, 0.2, 0.4, 0.6],
      }
    );

    navbarLinks.forEach((link) => {
      if (!link.href.startsWith("#")) return;

      const id = link.href.slice(1);
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
        observedSections.push(section);
      }
    });

    return () => {
      observedSections.forEach((section) => {
        observer.unobserve(section);
      });

      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearMonkeyTimers();
    };
  }, []);

  const navigateTo = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    setOpen(false);
    clearMonkeyTimers();

    /*
     * First show BYE BYE on the section we are leaving.
     */
    const leavingHref = activeHref || href;

    setMonkeyHref(leavingHref);
    setMonkeyMessage("Bye bye 👋");

    navigationTargetRef.current = href;

    /*
     * Give the monkey a short moment to wave,
     * then start the smooth scroll.
     */
    leaveTimerRef.current = setTimeout(() => {
      setMonkeyMessage("");

      if (href.startsWith("#")) {
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          window.history.pushState(null, "", href);
          return;
        }
      }

      window.location.href = href;
    }, 520);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-base/85 backdrop-blur-md"
            : "bg-transparent border-b border-border"
        }`}
      >
        <nav className="max-w-[90%] xl:w-[98%] mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href="/"
            className="font-display font-semibold text-sm tracking-wide text-ink"
          >
            PRIYA<span className="text-teal">.</span>SARAN
          </a>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navbarLinks.map((link) => {
              const isActive = activeHref === link.href;
              const showMonkeyHere =
                monkeyHref === link.href &&
                Boolean(monkeyMessage);

              return (
                <li
                  key={link.href}
                  className="relative"
                >
                  <a
                    href={link.href}
                    onClick={(event) =>
                      navigateTo(event, link.href)
                    }
                    className={`
                      group
                      relative
                      inline-block
                      pb-2
                      text-sm
                      transition-colors
                      duration-300
                      font-mono
                      tracking-wide
                      ${
                        isActive
                          ? "text-teal"
                          : "text-muted hover:text-teal"
                      }
                    `}
                  >
                    {link.label}

                    {/* Teal increasing underline */}
                    <span
                      className={`
                        pointer-events-none
                        absolute
                        left-0
                        bottom-0
                        h-[2px]
                        rounded-full
                        bg-teal
                        transition-all
                        duration-500
                        ease-out
                        ${
                          isActive
                            ? "w-full opacity-80"
                            : "w-0 group-hover:w-full"
                        }
                      `}
                    />

                    {/* Moving arrow at front of line */}
                    <span
                      className={`
                        pointer-events-none
                        absolute
                        bottom-[-7px]
                        z-10
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-base
                        text-teal
                        transition-all
                        duration-500
                        ease-out
                        shadow-[0_0_6px_#2dd4bf,0_0_14px_rgba(45,212,191,0.8)]
                        ${
                          isActive
                            ? "left-[calc(100%-7px)] opacity-100"
                            : "left-[-5px] opacity-0 group-hover:left-[calc(100%-7px)] group-hover:opacity-100"
                        }
                      `}
                    >
                      <ChevronRight
                        size={14}
                        strokeWidth={3}
                        className="drop-shadow-[0_0_4px_#2dd4bf]"
                      />
                    </span>

                    {/* Monkey sits on this nav item */}
                    {showMonkeyHere && (
                      <MiniMonkey
                        message={monkeyMessage}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Let's talk */}
          <a
            href="#contact"
            onClick={(event) =>
              navigateTo(event, "#contact")
            }
            className="
              hidden
              md:inline-flex
              items-center
              gap-2
              border
              border-teal/40
              text-teal
              text-sm
              font-mono
              px-4
              py-2
              rounded
              hover:bg-teal/10
              hover:border-teal
              transition-all
              duration-300
            "
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <PhoneCall
                size={15}
                strokeWidth={2}
                className="relative z-10 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.75)]"
              />
            </span>

            Let&apos;s talk
          </a>

          {/* Mobile menu */}
          <button
            className="md:hidden text-ink"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            aria-expanded={open}
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </nav>

        {/* Mobile navigation */}
        {open && (
          <div className="md:hidden bg-base/95 backdrop-blur-md border-b border-border px-6 pb-6">
            <ul className="flex flex-col gap-4 pt-2">
              {navbarLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) =>
                      navigateTo(event, link.href)
                    }
                    className="
                      group
                      relative
                      inline-block
                      pb-2
                      text-base
                      text-ink
                      hover:text-teal
                      font-mono
                      transition-colors
                      duration-300
                    "
                  >
                    {link.label}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        bottom-0
                        h-[2px]
                        w-0
                        rounded-full
                        bg-teal
                        transition-all
                        duration-500
                        ease-out
                        group-hover:w-full
                      "
                    />
                  </a>
                </li>
              ))}

              <li>
                <a
                  href="#contact"
                  onClick={(event) =>
                    navigateTo(event, "#contact")
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-2
                    border
                    border-teal/40
                    text-teal
                    text-sm
                    font-mono
                    px-4
                    py-2
                    rounded
                    hover:bg-teal/10
                    hover:border-teal
                    transition-all
                    duration-300
                  "
                >
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                    <PhoneCall
                      size={15}
                      strokeWidth={2}
                      className="relative z-10 text-emerald-400"
                    />
                  </span>

                  Let&apos;s talk
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <style jsx global>{`
        @keyframes monkeyWave {
          from {
            transform: rotate(-18deg);
          }
          to {
            transform: rotate(22deg);
          }
        }

        @keyframes monkeyBob {
          from {
            transform: translateY(0) rotate(-1deg);
          }
          to {
            transform: translateY(-3px) rotate(1deg);
          }
        }

        @keyframes monkeyPop {
          from {
            opacity: 0;
            transform: translate(-50%, -4px) scale(0.75);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\[monkeyWave_\.3s_ease-in-out_infinite_alternate\],
          .animate-\[monkeyBob_\.55s_ease-in-out_infinite_alternate\],
          .animate-\[monkeyPop_\.28s_ease-out\] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

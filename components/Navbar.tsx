"use client";

import { useRouter, usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";

/* =========================================================
   SOCIAL LINKS
   Replace these two values with the real LinkedIn + email.
========================================================= */

const LINKEDIN_URL = "www.linkedin.com/in/priya-saran-138462291";
const EMAIL_ADDRESS = "ps2297404@gmail.com";

function SocialIconButton({
  href,
  label,
  children,
  external = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
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
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-4
          w-4
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-indigo/35
          opacity-0
          transition-all
          duration-500
          ease-out
          group-hover:h-11
          group-hover:w-11
          group-hover:opacity-100
        "
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

      <span
        className="
          relative
          z-10
          flex
          items-center
          justify-center
          text-indigo/80
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:text-indigo
        "
      >
        {children}
      </span>
    </a>
  );
}

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
          items-center
          justify-between
          px-6
          xl:w-[98%]
        "
      >
        {/* =====================================================
            HOME / BRAND
        ====================================================== */}
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
          <span className="text-indigo">.</span>
          SARAN
        </button>

        {/* =====================================================
            SOCIAL ICONS
        ====================================================== */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* GITHUB - internal page */}
          <button
            type="button"
            onClick={goGitHub}
            aria-label="Open GitHub page"
            title="GitHub"
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

          {/* LINKEDIN */}
          <SocialIconButton
            href={LINKEDIN_URL}
            label="Open LinkedIn profile"
            external
          >
            <Linkedin size={20} strokeWidth={1.6} />
          </SocialIconButton>

          {/* MAIL */}
          <SocialIconButton
            href={`mailto:${EMAIL_ADDRESS}`}
            label="Send email"
          >
            <Mail size={20} strokeWidth={1.6} />
          </SocialIconButton>
        </div>
      </nav>
    </header>
  );
}

"use client";

import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

import { profile } from "@/lib/data";

export default function FooterIconPage() {
  // Change this to your actual Instagram URL
  const instagramUrl =
    "https://www.instagram.com/your_username";

  const phoneNumber =
    profile.phone?.replace(/\s/g, "") || "";

  return (
    <div className="flex items-center gap-4">

      {/* ========================================
          LINKEDIN
      ========================================= */}
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="social-button"
      >
        <div
          className="
            relative
            w-11
            h-11
            rounded-full
            group
          "
        >
          {/* Floating circle */}
          <div
            className="
              absolute
              top-0
              left-0
              w-full
              h-full
              rounded-full
              bg-[#0A66C2]

              transition-all
              duration-300

              group-hover:-top-8
              group-hover:shadow-[0_10px_30px_rgba(10,102,194,0.45)]
            "
          />

          {/* Icon */}
          <div
            className="
              relative
              z-10
              w-full
              h-full

              flex
              items-center
              justify-center

              rounded-full
              border-2
              border-[#0A66C2]

              bg-base

              transition-all
              duration-300
            "
          >
            <Linkedin
              size={19}
              className="
                text-[#0A66C2]
                transition-colors
                duration-300
              "
            />
          </div>
        </div>
      </a>


      {/* ========================================
          INSTAGRAM
      ========================================= */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="social-button"
      >
        <div
          className="
            relative
            w-11
            h-11
            rounded-full
            group
          "
        >
          {/* Floating circle */}
          <div
            className="
              absolute
              top-0
              left-0
              w-full
              h-full
              rounded-full

              bg-gradient-to-tr
              from-[#feda75]
              via-[#d62976]
              to-[#4f5bd5]

              transition-all
              duration-300

              group-hover:-top-8
              group-hover:shadow-[0_10px_30px_rgba(214,41,118,0.45)]
            "
          />

          {/* Icon */}
          <div
            className="
              relative
              z-10
              w-full
              h-full

              flex
              items-center
              justify-center

              rounded-full
              border-2
              border-[#d62976]

              bg-base

              transition-all
              duration-300
            "
          >
            <Instagram
              size={19}
              className="
                text-[#d62976]
              "
            />
          </div>
        </div>
      </a>


      {/* ========================================
          EMAIL
      ========================================= */}
      <a
        href={`mailto:${profile.email}`}
        aria-label="Email"
        className="social-button"
      >
        <div
          className="
            relative
            w-11
            h-11
            rounded-full
            group
          "
        >
          {/* Floating circle */}
          <div
            className="
              absolute
              top-0
              left-0
              w-full
              h-full
              rounded-full

              bg-red-500

              transition-all
              duration-300

              group-hover:-top-8
              group-hover:shadow-[0_10px_30px_rgba(239,68,68,0.45)]
            "
          />

          {/* Icon */}
          <div
            className="
              relative
              z-10
              w-full
              h-full

              flex
              items-center
              justify-center

              rounded-full
              border-2
              border-red-500

              bg-base

              transition-all
              duration-300
            "
          >
            <Mail
              size={19}
              className="text-red-500"
            />
          </div>
        </div>
      </a>


      {/* ========================================
          CALL
      ========================================= */}
      <a
        href={`tel:${phoneNumber}`}
        aria-label="Call"
        className="social-button"
      >
        <div
          className="
            relative
            w-11
            h-11
            rounded-full
            group
          "
        >
          {/* Floating circle */}
          <div
            className="
              absolute
              top-0
              left-0
              w-full
              h-full
              rounded-full

              bg-green-500

              transition-all
              duration-300

              group-hover:-top-8
              group-hover:shadow-[0_10px_30px_rgba(34,197,94,0.45)]
            "
          />

          {/* Icon */}
          <div
            className="
              relative
              z-10
              w-full
              h-full

              flex
              items-center
              justify-center

              rounded-full
              border-2
              border-green-500

              bg-base

              transition-all
              duration-300
            "
          >
            <Phone
              size={18}
              className="text-green-500"
            />
          </div>
        </div>
      </a>

    </div>
  );
}
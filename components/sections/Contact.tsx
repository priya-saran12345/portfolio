"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { profile } from "@/lib/data";
import SpotlightBackground from "@/components/three/SpotlightBackground";
// import FooterIconPage from "../common/footericon";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;

    const data = {
      name: (
        form.elements.namedItem(
          "name"
        ) as HTMLInputElement
      ).value,

      email: (
        form.elements.namedItem(
          "email"
        ) as HTMLInputElement
      ).value,

      message: (
        form.elements.namedItem(
          "message"
        ) as HTMLTextAreaElement
      ).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          body.error ||
            "Something went wrong. Please try again."
        );
      }

      setStatus("sent");

      form.reset();

      // Optional: remove success message after some time
      window.setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (err) {
      setStatus("error");

      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section
      id="contact"
      className="
        relative
        isolate
        overflow-hidden
        border-t
        border-border
        pt-12
        md:pt-20
        pb-4 md:pb-8
      "
    >
      {/* =========================================
          THREE.JS SPOTLIGHT BACKGROUND
      ========================================== */}
      <SpotlightBackground />

      {/* =========================================
          CONTACT CONTENT
          z-10 keeps everything above Three.js
      ========================================== */}
      <div
        className="
          relative
          z-10
          max-w-[90%]
          xl:w-[98%]
          mx-auto
          px-6
        "
      >
        <div
          className="
            grid
lg:grid-cols-[1fr_460px]
            gap-12
            lg:gap-16
            items-start
          "
        >
          {/* =====================================
              LEFT SIDE
          ====================================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
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
              duration: 0.55,
            }}
          >
            <p className="section-label mb-3">
              05 — Get in touch
            </p>

            <h2
              className="
                font-display
                text-3xl
                md:text-5xl
                font-semibold
                text-ink
                mb-6
              "
            >
              Let&apos;s build
              <br />
              <span className="text-teal">
                something.
              </span>
            </h2>

            <p
              className="
                text-muted
                max-w-sm
                leading-relaxed
                mb-10
              "
            >
              Have a product, dashboard, or site
              that needs a full-stack developer?
              I&apos;m currently open to new roles
              and freelance projects — reach out
              below.
            </p>

            {/* Contact links */}
            <div className="flex flex-col gap-4">
              {/* EMAIL */}
              <a
                href={`mailto:${profile.email}`}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  w-fit
                  text-sm
                  text-ink/85
                  hover:text-teal
                  transition-colors
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-teal/30
                    bg-teal/10
                    transition-all
                    duration-300
                    group-hover:border-teal/60
                    group-hover:bg-teal/15
                    group-hover:shadow-[0_0_18px_rgba(45,212,191,0.18)]
                  "
                >
                  <Mail
                    size={16}
                    className="text-teal"
                  />
                </span>

                {profile.email}
              </a>

              {/* LINKEDIN */}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  w-fit
                  text-sm
                  text-ink/85
                  hover:text-teal
                  transition-colors
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-teal/30
                    bg-teal/10
                    transition-all
                    duration-300
                    group-hover:border-teal/60
                    group-hover:bg-teal/15
                    group-hover:shadow-[0_0_18px_rgba(45,212,191,0.18)]
                  "
                >
                  <Linkedin
                    size={16}
                    className="text-teal"
                  />
                </span>

                linkedin.com/in/priya-saran
              </a>
            </div>
            <div className="mt-3">

            {/* <FooterIconPage/> */}
            </div>
          </motion.div>

          {/* =====================================
              CONTACT FORM
          ====================================== */}
          <motion.form
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
              margin: "-80px",
            }}
            transition={{
              duration: 0.55,
              delay: 0.08,
            }}
            onSubmit={handleSubmit}
className="
  relative
  w-full
  lg:justify-self-end

  overflow-hidden
  rounded-2xl
  border
  border-border
  bg-surface/80
  backdrop-blur-xl
  p-6
  md:p-7
  flex
  flex-col
  gap-5
  shadow-[0_20px_70px_rgba(0,0,0,0.25)]
"          >
            {/* subtle teal glow */}
            <div
              className="
                pointer-events-none
                absolute
                -top-24
                -right-24
                h-52
                w-52
                rounded-full
                bg-teal/10
                blur-3xl
              "
            />

            {/* NAME */}
            <div className="relative flex flex-col gap-2">
              <label
                htmlFor="name"
                className="
                  text-xs
                  font-mono 
                  uppercase
                  tracking-widest
                  text-muted
                "
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="
                  bg-base/80
                  border
                  border-border
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  text-ink
                  placeholder:text-muted/60
                  focus:border-teal/60
                  focus:ring-1
                  focus:ring-teal/20
                  outline-none
                  transition-all
                "
              />
            </div>

            {/* EMAIL */}
            <div className="relative flex flex-col gap-2">
              <label
                htmlFor="email"
                className="
                  text-xs
                  font-mono
                  uppercase
                  tracking-widest
                  text-muted
                "
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="
                  bg-base/80
                  border
                  border-border
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  text-ink
                  placeholder:text-muted/60
                  focus:border-teal/60
                  focus:ring-1
                  focus:ring-teal/20
                  outline-none
                  transition-all
                "
              />
            </div>

            {/* MESSAGE */}
            <div className="relative flex flex-col gap-2">
              <label
                htmlFor="message"
                className="
                  text-xs
                  font-mono
                  uppercase
                  tracking-widest
                  text-muted
                "
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project..."
                className="
                  bg-base/80
                  border
                  border-border
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  text-ink
                  placeholder:text-muted/60
                  focus:border-teal/60
                  focus:ring-1
                  focus:ring-teal/20
                  outline-none
                  transition-all
                  resize-none
                "
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="
                relative
                mt-2
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                bg-teal
                text-base
                font-semibold
                text-sm
                px-6
                py-3.5
                rounded-lg
                hover:bg-teal/90
                hover:shadow-[0_0_24px_rgba(45,212,191,0.25)]
                transition-all
                duration-300
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {status === "sending" && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {status === "sending"
                ? "Sending..."
                : "Send message"}
            </button>

            {/* SUCCESS */}
            {status === "sent" && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-teal
                "
              >
                <CheckCircle2 size={16} />

                Message sent — I&apos;ll get back
                to you soon.
              </motion.p>
            )}

            {/* ERROR */}
            {status === "error" && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-red-400
                "
              >
                <AlertCircle size={16} />

                {errorMsg}
              </motion.p>
            )}
          </motion.form>
        </div>
        {/* =========================================
            FOOTER
        ========================================== */}
        <div
          className="
            mt-24
            pt-8
            border-border
            flex
            items-center
            justify-center
            text-center
            text-xs
            text-muted
            font-mono
          "
        >
          <span>
            Developed by{" "}
            <span className="text-teal">
              {profile.name}
            </span>
            ....
          </span>
        </div>
      </div>
    </section>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Send,
} from "lucide-react";

import { profile } from "@/lib/data";
import SpotlightBackground from "@/components/three/SpotlightBackground";

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
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

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      setErrorMsg(
        "Contact form is not configured. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to .env.local."
      );
      return;
    }

    const name = (
      form.elements.namedItem(
        "name"
      ) as HTMLInputElement
    ).value.trim();

    const email = (
      form.elements.namedItem(
        "email"
      ) as HTMLInputElement
    ).value.trim();

    const message = (
      form.elements.namedItem(
        "message"
      ) as HTMLTextAreaElement
    ).value.trim();

    const botcheck = (
      form.elements.namedItem(
        "botcheck"
      ) as HTMLInputElement | null
    )?.checked ?? false;

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,

      name,
      email,
      message,

      subject: `Portfolio Contact - ${name}`,
      from_name: "Priya Saran Portfolio",

      /*
       * Web3Forms automatically uses the submitted
       * "email" field as Reply-To.
       */
      botcheck,
    };

    try {
      const res = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await res
        .json()
        .catch(() => null);

      if (
        !res.ok ||
        !result ||
        result.success !== true
      ) {
        throw new Error(
          result?.message ||
            result?.body?.message ||
            "Unable to send your message. Please try again."
        );
      }

      setStatus("sent");
      form.reset();

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
      border-border
      pt-16
      md:pt-24
      pb-6
      md:pb-10
    "
  >
    {/* THREE BACKGROUND */}
    <SpotlightBackground />

    {/* ========================================= */}
    {/* BACKGROUND GRID */}
    {/* ========================================= */}

    <div
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(255,255,255,0.035) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255,255,255,0.035) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "50px 50px",
      }}
    />

    {/* LARGE BACKGROUND TEXT */}

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className="
        absolute
        top-[5%]
        left-1/2
        -translate-x-1/2

        whitespace-nowrap

        font-display
        font-black

        text-[90px]
        sm:text-[140px]
        md:text-[200px]
        lg:text-[260px]

        leading-none
        tracking-[-0.06em]

        text-white/[0.018]

        select-none
        pointer-events-none
      "
    >
      LET&apos;S TALK
    </motion.div>

    {/* LEFT GLOW */}

    <motion.div
      className="
        absolute
        left-[-180px]
        top-[30%]

        w-[450px]
        h-[450px]

        rounded-full

        bg-teal/[0.05]
        blur-[120px]

        pointer-events-none
      "
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* RIGHT GLOW */}

    <motion.div
      className="
        absolute
        right-[-150px]
        bottom-[5%]

        w-[400px]
        h-[400px]

        rounded-full

        bg-indigo/[0.05]
        blur-[130px]

        pointer-events-none
      "
      animate={{
        y: [-25, 25, -25],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* ========================================= */}
    {/* CONTENT */}
    {/* ========================================= */}

    <div
      className="
        relative
        z-10

        max-w-[90%]
        xl:w-[94%]

        mx-auto
        px-4
        sm:px-6
      "
    >
      <div
        className="
          grid
          lg:grid-cols-[1fr_480px]
          gap-14
          lg:gap-20
          items-center
        "
      >
        {/* ========================================= */}
        {/* LEFT */}
        {/* ========================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
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
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* AVAILABILITY */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.15,
            }}
            className="
              inline-flex
              items-center
              gap-3

              border
              border-white/[0.08]

              bg-surface/60
              backdrop-blur-md

              rounded-full

              px-4
              py-2

              mb-7
            "
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-teal
                "
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <span
                className="
                  relative
                  inline-flex
                  rounded-full
                  h-2
                  w-2
                  bg-teal
                "
              />
            </span>

            <span
              className="
                font-mono
                text-[9px]
                sm:text-[10px]
                uppercase
                tracking-[0.22em]
                text-muted
              "
            >
              Available for selected projects
            </span>
          </motion.div>

          {/* SECTION LABEL */}

          <p className=" mb-4">
            04 — Get in touch
          </p>

          {/* HEADING */}

          <h2
            className="
              font-display

              text-[22px]
              sm:text-3xl
              md:text-4xl
              lg:text-[52px]

              leading-1

              font-semibold
              tracking-[-0.04em]

              text-ink

              mb-7
            "
          >
            Have an idea?
            <br />

            <span
              className="
                relative
                mt-2
                inline-block
                text-teal
              "
            >
              Let&apos;s build it.

              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                }}
                className="
                  absolute
                  left-0
                  -bottom-2

                  h-px

                  bg-gradient-to-r
                  from-teal
                  via-teal/60
                  to-transparent
                "
              />
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              max-w-md

              text-sm
              md:text-[15px]

              text-muted

              leading-7

              mb-10
            "
          >
            Have a product, dashboard, platform or digital experience
            in mind? Tell me what you&apos;re building and let&apos;s turn
            the idea into something people enjoy using.
          </p>

          {/* ========================================= */}
          {/* CONTACT OPTIONS */}
          {/* ========================================= */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
          >
            {/* EMAIL */}

            <motion.a
              href={`mailto:${profile.email}`}
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                group

                relative
                overflow-hidden

                flex
                items-center
                gap-4

                border
                border-white/[0.08]

                bg-surface/60
                backdrop-blur-lg

                rounded-xl

                px-4
                py-3.5

                transition-all
                duration-300

                hover:border-teal/30
                hover:bg-surface
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center

                  w-10
                  h-10

                  rounded-lg

                  bg-teal/10

                  border
                  border-teal/20

                  transition-all
                  duration-300

                  group-hover:bg-teal/15
                  group-hover:border-teal/40
                "
              >
                <Mail
                  size={17}
                  className="text-teal"
                />
              </div>

              <div>
                <span
                  className="
                    block

                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.18em]

                    text-muted

                    mb-1
                  "
                >
                  Email
                </span>

                <span
                  className="
                    text-xs
                    sm:text-sm
                    text-ink
                  "
                >
                  {profile.email}
                </span>
              </div>

              <ArrowUpRight
                size={15}
                className="
                  ml-auto
                  text-muted

                  transition-all
                  duration-300

                  group-hover:text-teal
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </motion.a>

            {/* LINKEDIN */}

            <motion.a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                group

                relative
                overflow-hidden

                flex
                items-center
                gap-4

                border
                border-white/[0.08]

                bg-surface/60
                backdrop-blur-lg

                rounded-xl

                px-4
                py-3.5

                transition-all
                duration-300

                hover:border-teal/30
                hover:bg-surface
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center

                  w-10
                  h-10

                  rounded-lg

                  bg-teal/10

                  border
                  border-teal/20

                  transition-all
                  duration-300

                  group-hover:bg-teal/15
                  group-hover:border-teal/40
                "
              >
                <Linkedin
                  size={17}
                  className="text-teal"
                />
              </div>

              <div>
                <span
                  className="
                    block

                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.18em]

                    text-muted

                    mb-1
                  "
                >
                  LinkedIn
                </span>

                <span
                  className="
                    text-xs
                    sm:text-sm
                    text-ink
                  "
                >
                  Connect with me
                </span>
              </div>

              <ArrowUpRight
                size={15}
                className="
                  ml-auto
                  text-muted

                  transition-all
                  duration-300

                  group-hover:text-teal
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </motion.a>
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <motion.form
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
            margin: "-80px",
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          onSubmit={handleSubmit}
          className="
            group/form

            relative

            w-full
            lg:justify-self-end

            overflow-hidden

            rounded-2xl

            border
            border-white/[0.08]

            bg-surface/90

            backdrop-blur-2xl

            p-6
            sm:p-7
            md:p-8

            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          "
        >
          {/* Web3Forms spam honeypot */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            style={{ display: "none" }}
            aria-hidden="true"
          />

          {/* FORM GRID */}

          <div
            className="
              absolute
              inset-0

              pointer-events-none

              opacity-40
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.025) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.025) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "32px 32px",
            }}
          />

          {/* MOVING GLOW */}

          <motion.div
            className="
              absolute
              -top-28
              -right-28

              h-64
              w-64

              rounded-full

              bg-teal/10

              blur-[80px]

              pointer-events-none
            "
            animate={{
              x: [-20, 20, -20],
              y: [-10, 20, -10],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* TOP SCAN LINE */}

          <motion.div
            className="
              absolute
              top-0
              left-0

              h-px
              w-[45%]

              bg-gradient-to-r
              from-transparent
              via-teal
              to-transparent

              pointer-events-none
            "
            animate={{
              x: ["-100%", "320%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1,
            }}
          />

          {/* CORNERS */}

          <div
            className="
              absolute
              left-3
              top-3
              w-4
              h-4

              border-l
              border-t
              border-teal/50

              pointer-events-none
            "
          />

          <div
            className="
              absolute
              right-3
              bottom-3
              w-4
              h-4

              border-r
              border-b
              border-teal/50

              pointer-events-none
            "
          />

          {/* FORM HEADER */}

          <div
            className="
              relative
              z-10

              flex
              items-center
              justify-between

              mb-7
            "
          >
            <div>
              <p
                className="
                  font-mono

                  text-[9px]

                  text-muted

                  uppercase
                  tracking-[0.22em]

                  mb-1
                "
              >
                Start a conversation
              </p>

              <h3
                className="
                  text-lg
                  font-semibold
                  text-ink
                "
              >
                Tell me about your project
              </h3>
            </div>

            <div
              className="
                w-9
                h-9

                flex
                items-center
                justify-center

                rounded-full

                border
                border-white/[0.08]

                text-muted
              "
            >
              <Send size={15} />
            </div>
          </div>

          {/* ========================================= */}
          {/* NAME */}
          {/* ========================================= */}

          <div className="relative z-10 mb-5">
            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >
              <label
                htmlFor="name"
                className="
                  font-mono
                  text-[10px]

                  uppercase
                  tracking-[0.2em]

                  text-muted
                "
              >
                Name
              </label>

              <span
                className="
                  font-mono
                  text-[9px]
                  text-white/20
                "
              >
                01
              </span>
            </div>

            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className="
                w-full

                bg-base/70

                border
                border-white/[0.07]

                rounded-xl

                px-4
                py-3.5

                text-sm
                text-ink

                placeholder:text-muted/50

                outline-none

                transition-all
                duration-300

                hover:border-white/[0.13]

                focus:border-teal/50
                focus:bg-base
                focus:ring-1
                focus:ring-teal/10
              "
            />
          </div>

          {/* ========================================= */}
          {/* EMAIL */}
          {/* ========================================= */}

          <div className="relative z-10 mb-5">
            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >
              <label
                htmlFor="email"
                className="
                  font-mono
                  text-[10px]

                  uppercase
                  tracking-[0.2em]

                  text-muted
                "
              >
                Email
              </label>

              <span
                className="
                  font-mono
                  text-[9px]
                  text-white/20
                "
              >
                02
              </span>
            </div>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="
                w-full

                bg-base/70

                border
                border-white/[0.07]

                rounded-xl

                px-4
                py-3.5

                text-sm
                text-ink

                placeholder:text-muted/50

                outline-none

                transition-all
                duration-300

                hover:border-white/[0.13]

                focus:border-teal/50
                focus:bg-base
                focus:ring-1
                focus:ring-teal/10
              "
            />
          </div>

          {/* ========================================= */}
          {/* MESSAGE */}
          {/* ========================================= */}

          <div className="relative z-10 mb-6">
            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >
              <label
                htmlFor="message"
                className="
                  font-mono
                  text-[10px]

                  uppercase
                  tracking-[0.2em]

                  text-muted
                "
              >
                Message
              </label>

              <span
                className="
                  font-mono
                  text-[9px]
                  text-white/20
                "
              >
                03
              </span>
            </div>

            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              className="
                w-full

                bg-base/70

                border
                border-white/[0.07]

                rounded-xl

                px-4
                py-3.5

                text-sm
                text-ink

                placeholder:text-muted/50

                outline-none
                resize-none

                transition-all
                duration-300

                hover:border-white/[0.13]

                focus:border-teal/50
                focus:bg-base
                focus:ring-1
                focus:ring-teal/10
              "
            />
          </div>

          {/* ========================================= */}
          {/* BUTTON */}
          {/* ========================================= */}

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={
              status !== "sending"
                ? {
                    scale: 1.015,
                  }
                : {}
            }
            whileTap={
              status !== "sending"
                ? {
                    scale: 0.985,
                  }
                : {}
            }
            className="
              group/button

              relative
              z-10

              w-full

              overflow-hidden

              inline-flex
              items-center
              justify-center

              gap-2

              bg-teal

              text-base
              font-semibold
              text-sm

              px-6
              py-3.5

              rounded-xl

              transition-all
              duration-300

              hover:shadow-[0_0_35px_rgba(45,212,191,0.25)]

              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {/* BUTTON SHINE */}

            <span
              className="
                absolute
                inset-y-0
                -left-[50%]

                w-[35%]

                skew-x-[-20deg]

                bg-white/20

                transition-all
                duration-700

                group-hover/button:left-[130%]
              "
            />

            {status === "sending" ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Sending...
              </>
            ) : (
              <>
                Send message

                <Send
                  size={15}
                  className="
                    transition-transform
                    duration-300

                    group-hover/button:translate-x-1
                    group-hover/button:-translate-y-1
                  "
                />
              </>
            )}
          </motion.button>

          {/* SUCCESS */}

          {status === "sent" && (
            <motion.p
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                relative
                z-10

                flex
                items-center
                gap-2

                mt-4

                text-sm
                text-teal
              "
            >
              <CheckCircle2 size={16} />

              Message sent — I&apos;ll get back to you soon.
            </motion.p>
          )}

          {/* ERROR */}

          {status === "error" && (
            <motion.p
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                relative
                z-10

                flex
                items-center
                gap-2

                mt-4

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

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      <div
        className="
          mt-20
          md:mt-28
          pt-7

          border-t
          border-white/[0.05]

          flex
          items-center
          justify-between

          font-mono
          text-[9px]
          sm:text-[10px]

          uppercase
          tracking-[0.16em]

          text-muted/50
        "
      >
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>

        <span className="hidden sm:block">
          Designed &amp; developed with precision
        </span>
      </div>
    </div>
  </section>
);}

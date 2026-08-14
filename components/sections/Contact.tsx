"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="relative bg-base border-t border-border py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16">
          <div>
            <p className="section-label mb-3">05 — Get in touch</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink mb-6">
              Let&apos;s build
              <br />
              something.
            </h2>
            <p className="text-muted max-w-sm leading-relaxed mb-10">
              Have a product, dashboard, or site that needs a full-stack developer? I&apos;m
              currently open to new roles and freelance projects — reach out below.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-sm text-ink/85 hover:text-teal transition-colors"
              >
                <Mail size={16} className="text-teal shrink-0" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-sm text-ink/85 hover:text-teal transition-colors"
              >
                <Phone size={16} className="text-teal shrink-0" />
                {profile.phone}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-ink/85 hover:text-teal transition-colors"
              >
                <Linkedin size={16} className="text-teal shrink-0" />
                linkedin.com/in/priya-saran
              </a>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-surface border border-border rounded-lg p-6 md:p-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-muted">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="bg-base border border-border rounded px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-teal/50 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="bg-base border border-border rounded px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-teal/50 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project..."
                className="bg-base border border-border rounded px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-teal/50 outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-teal text-base font-semibold text-sm px-6 py-3.5 rounded hover:bg-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" && <Loader2 size={16} className="animate-spin" />}
              {status === "sending" ? "Sending..." : "Send message"}
            </button>

            {status === "sent" && (
              <p className="flex items-center gap-2 text-sm text-teal">
                <CheckCircle2 size={16} />
                Message sent — I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle size={16} />
                {errorMsg}
              </p>
            )}
          </motion.form>
        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Built with Next.js, TypeScript &amp; Three.js</span>
        </div>
      </div>
    </section>
  );
}

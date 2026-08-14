"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="relative bg-base border-t border-border py-16 md:py-24">
      <div className="max-w-[90%] xl:w-[98%] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="section-label mb-3">01 — Toolkit</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">Skills</h2>
          </div>
          <p className="text-muted max-w-sm text-sm leading-relaxed">
            The stack I reach for when turning a requirement into a shipped, maintained feature —
            front end through to database and deploy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="border-b border-border pb-8"
            >
              <h3 className="font-mono text-xs tracking-widest uppercase text-teal mb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-ink/85 bg-surface border border-border rounded px-3 py-1.5 hover:border-teal/40 hover:text-teal transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

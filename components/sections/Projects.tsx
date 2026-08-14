"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="relative bg-surface border-t border-border py-24 md:py-32">
      <div className="max-w-[90%] xl:w-[98%] mx-auto px-6">
        <div className="mb-16">
          <p className="section-label mb-3">04 — Selected work</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">Projects</h2>
        </div>

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-12 py-8 border-b border-border group"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-ink group-hover:text-teal transition-colors">
                  {project.title}
                </h3>
                <p className="font-mono text-xs text-muted mt-2">{project.stack}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {project.points.map((p, idx) => (
                  <li key={idx} className="text-sm text-ink/75 leading-relaxed flex gap-2">
                    <span className="text-teal mt-1.5 shrink-0">▸</span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

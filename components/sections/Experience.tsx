"use client";

import { motion } from "framer-motion";
import { experience, education, certifications } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="relative bg-base border-t border-border py-24 md:py-32">
      <div className="max-w-[90%] xl:w-[98%] mx-auto px-6">
        <div className="mb-16">
          <p className="section-label mb-3">03 — Track record</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">Experience</h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            <div className="flex flex-col gap-14">
              {experience.map((job, i) => (
                <motion.div
                  key={job.company}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-8"
                >
                  <span
                    className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 ${
                      i === 0 ? "bg-teal border-teal" : "bg-base border-muted"
                    }`}
                  />
                  <p className="font-mono text-xs text-teal mb-1.5">{job.period}</p>
                  <h3 className="font-display text-xl font-semibold text-ink">{job.role}</h3>
                  <p className="text-sm text-muted mb-3">{job.company}</p>
                  <ul className="flex flex-col gap-2">
                    {job.points.map((p, idx) => (
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

          {/* Sidebar: education + certifications */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-mono text-xs tracking-widest uppercase text-teal mb-5">
                Education
              </h3>
              <div className="flex flex-col gap-6">
                {education.map((ed) => (
                  <div key={ed.degree} className="border-l border-border pl-4">
                    <p className="font-mono text-xs text-muted mb-1">{ed.period}</p>
                    <p className="text-sm font-medium text-ink">{ed.degree}</p>
                    <p className="text-sm text-muted">{ed.school}</p>
                    {ed.notes.length > 0 && (
                      <ul className="mt-2 flex flex-col gap-1">
                        {ed.notes.map((n) => (
                          <li key={n} className="text-xs text-ink/60">
                            • {n}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs tracking-widest uppercase text-teal mb-5">
                Certifications
              </h3>
              <ul className="flex flex-col gap-2">
                {certifications.map((c) => (
                  <li key={c} className="text-xs text-ink/70 leading-relaxed border-b border-border pb-2">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

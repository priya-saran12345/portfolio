"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="relative bg-surface border-t border-border py-12 md:py-24">
      <div className="max-w-[90%] xl:w-[98%] mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="section-label mb-3">02 — What I do</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink">Services</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 bg-border">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-surface border rounded-lg p-8 flex flex-col justify-between 
              min-h-[220px] group hover:bg-surface2 transition-colors"
            >
              <div>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold text-ink mt-4 mb-3 group-hover:text-teal transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

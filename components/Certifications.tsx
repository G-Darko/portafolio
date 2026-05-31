"use client";

import { motion } from "motion/react";
import { certifications } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certificaciones" className="mx-auto w-[90%] py-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-10 text-center text-3xl font-bold"
      >
        <span className="text-accent">Certificaciones</span>
      </motion.h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(102,204,255,0.15)]"
          >
            <h3 className="text-lg font-semibold text-accent">
              {cert.title}
            </h3>
            <p className="mt-2 text-sm font-extrabold italic">{cert.org}</p>
            <p className="mt-1 text-sm">{cert.date}</p>
            {cert.folio && (
              <p className="mt-1 text-sm">
                Folio para validar: <b>{cert.folio}</b>
              </p>
            )}
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-bold text-accent hover:underline"
              >
                {cert.linkText}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

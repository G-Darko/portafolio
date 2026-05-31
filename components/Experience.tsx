"use client";

import { motion } from "motion/react";
import { experiences } from "@/lib/data";
import { ExternalLink } from "lucide-react";

export default function Experience() {
  return (
    <section id="experiencia" className="mx-auto w-[90%] py-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-10 text-center text-3xl font-bold"
      >
        <span className="text-[var(--accent)]">Experiencia</span>
      </motion.h2>

      <div className="relative mx-auto max-w-[1200px] px-5">
        <div
          className="absolute top-0 bottom-0 left-4 w-1 md:left-1/2 md:-translate-x-1/2"
          style={{ background: "linear-gradient(var(--lg))" }}
        />

        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative mb-8 w-full pl-14 md:w-1/2 ${
              i % 2 === 0 ? "md:pr-10 md:pl-0" : "md:ml-auto md:pl-10"
            }`}
          >
            <div
              className={`absolute top-5 h-4 w-4 rounded-full border-4 border-[var(--card)] bg-[var(--accent)] md:left-auto ${
                i % 2 === 0 ? "left-4 md:-right-2" : "left-4 md:-left-2"
              }`}
            />
            <div className="relative rounded-lg border border-[var(--gris)] bg-[var(--card)] p-5 transition-transform duration-300 hover:-translate-y-2">
              <div
                className={`absolute top-5 h-0 w-0 border-[10px] border-transparent md:block hidden ${
                  i % 2 === 0
                    ? "-right-5 border-l-[var(--card)]"
                    : "-left-5 border-r-[var(--card)]"
                }`}
              />
              <h3 className="text-lg font-semibold">
                <span className="text-[var(--accent)]">
                  {exp.role} -{" "}
                  {exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 italic underline decoration-inherit transition-colors hover:text-[var(--c2)]"
                    >
                      {exp.company}
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    exp.company
                  )}
                </span>
              </h3>
              <span className="mt-1 block text-sm font-semibold italic">
                {exp.date}
              </span>
              <p className="mt-3 text-sm leading-relaxed">{exp.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--gris)] px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

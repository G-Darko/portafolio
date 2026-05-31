"use client";

import { motion } from "motion/react";
import { skillCategories } from "@/lib/data";
import SkillIcon from "./SkillIcon";

export default function Skills() {
  return (
    <section id="habilidades" className="mx-auto w-[90%] py-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-10 text-center text-3xl font-bold"
      >
        <span className="text-accent">Habilidades</span>
      </motion.h2>

      <div className="flex flex-col items-center gap-20">
        {skillCategories.map((cat, ci) => (
          <div
            key={cat.title}
            className="relative mb-10 w-full max-w-4xl"
          >
            <h2
              className="absolute top-4 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-bold uppercase text-accent"
              style={{
                ...(ci % 2 === 0
                  ? { left: "-50px" }
                  : { left: "auto", right: "-50px" }),
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                animation: ci % 2 === 0
                  ? "zoomText 2s infinite alternate ease-in-out"
                  : "zoomTextEven 2s infinite alternate ease-in-out",
                transformOrigin: "center center",
                transform: ci % 2 === 0
                  ? "rotate(var(--deg))"
                  : "rotate(var(--deg-even))",
              }}
            >
              {cat.title}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(70px,auto))] justify-around gap-6 rounded-xl bg-card p-6">
              {cat.skills.map((skill) => (
                <SkillIcon
                  key={skill.name}
                  icon={skill.icon}
                  name={skill.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

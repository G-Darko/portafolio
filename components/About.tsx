"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";

export default function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-[90%] py-10">
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center"
      >
        <h2 className="w-full py-10 text-center text-3xl font-bold">
          <span className="text-accent">Sobre mí</span>
        </h2>
        <p className="max-w-3xl text-center text-base leading-relaxed">
          Ingeniero en Tecnologías de la Información. Apasionado por el desarrollo web y de
          software. Me encanta aprender nuevas tecnologías y mejorar mis habilidades en
          programación. Actualmente, estoy trabajando en proyectos que me permiten aplicar mis
          conocimientos y seguir creciendo como desarrollador. Me considero una persona analítica
          y siempre dispuesta a enfrentar nuevos desafíos y destaco por mi capacidad de
          adaptación, aprendizaje rápido y enfoque en la eficiencia.
        </p>
      </motion.article>
    </section>
  );
}

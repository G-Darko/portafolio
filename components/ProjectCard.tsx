"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Project } from "@/lib/data";
import { asset } from "@/lib/asset";
import ProjectModal from "./ProjectModal";

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="relative flex flex-wrap overflow-hidden rounded-xl bg-card">
        <figure className="flex w-full items-center justify-center md:w-1/2 bg-card p-2">
          <Image
            src={asset(project.images[0])}
            alt={project.title}
            width={600}
            height={340}
            className="aspect-video w-full rounded-lg object-contain"
          />
        </figure>
        <div className="flex w-full flex-col justify-between bg-complement p-5 md:w-1/2">
          <div>
            <h4 className="text-lg font-semibold">
              <span className="text-accent">
                {project.title} {project.subtitle && <i>- {project.subtitle}</i>}
              </span>
            </h4>
            <div className="mt-2">
              <b>Descripción</b>
              <div className="mt-1 max-h-[130px] overflow-y-auto text-sm leading-relaxed">
                <p>{project.description}</p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-widest transition-colors duration-500 hover:bg-gradient-to-r hover:from-c1 hover:to-c2 md:w-auto"
          >
            Ver más
          </motion.button>
        </div>
      </article>
      {open && <ProjectModal project={project} onClose={() => setOpen(false)} />}
    </>
  );
}

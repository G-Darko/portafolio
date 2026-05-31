"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Mail, ExternalLink } from "lucide-react";
import { asset } from "@/lib/asset";

const texts = [
  "Desarrollador web & ",
  "de Software: ",
  "Frontend &",
  "Backend.",
];

const GitHubIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % texts.length);
        setFade(true);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="inicio"
      className="flex flex-wrap items-center justify-around gap-8 px-5 py-8 border-b border-accent"
    >
      <motion.article
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-[350px] rounded-2xl bg-card/85 p-8"
      >
        <div className="text-3xl font-normal">Gael Uribe</div>
        <div className="mt-2 text-2xl font-bold">
          <span
            className={`inline-block transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {texts[index]}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://github.com/G-Darko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text transition-colors duration-500 hover:text-accent"
          >
            <GitHubIcon size={22} />
            <b className="border-l border-accent bg-bg px-1 text-lg">Github</b>
          </a>
          <a
            href="https://www.credly.com/users/g-darko"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text transition-colors duration-500 hover:text-accent"
          >
            <ExternalLink size={22} />
            <b className="border-l border-accent bg-bg px-1 text-lg">Credly</b>
          </a>
          <a
            href="#contacto"
            className="flex items-center gap-2 text-text transition-colors duration-500 hover:text-accent"
          >
            <Mail size={22} />
            <b className="border-l border-accent bg-bg px-1 text-lg">Contacto</b>
          </a>
        </div>
      </motion.article>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative flex items-center justify-center"
      >
        <Image
          src={asset("/img/fondo.gif")}
          alt=""
          width={350}
          height={350}
          className="rounded-full object-cover opacity-60"
          style={{ animation: "hueRotate 5s linear infinite" }}
          unoptimized
        />
        <div
          className="absolute h-[245px] w-[245px] rounded-full opacity-60"
          style={{
            background: "linear-gradient(var(--lg))",
            animation: "animateBlur 5s linear infinite",
          }}
        />
        <div
          className="absolute h-[200px] w-[200px] rounded-full"
          style={{
            background: "linear-gradient(var(--lg))",
            animation: "animateBlur 5s linear infinite",
          }}
        />
        <div className="absolute z-10 h-[157px] w-[157px] overflow-hidden rounded-full">
          <Image
            src={asset("/img/DARKO.png")}
            alt="Gael Uribe"
            fill
            sizes="157px"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}

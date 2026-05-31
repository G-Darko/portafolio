"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre mi" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#certificaciones", label: "Certificaciones" },
];

import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [active, setActive] = useState("#inicio");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map((l) => l.href.replace("#", ""));
      let current = sections[0];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = section;
        }
      }
      setActive("#" + current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setActive(href);
    setMobileOpen(false);
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-[var(--accent)] bg-[var(--card)]/85 backdrop-blur-sm px-4 py-3"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between">
        <h1
          className="cursor-pointer pl-4 text-2xl font-bold"
          onClick={() => handleClick("#inicio")}
        >
          <span className="text-[var(--accent)]">G-Darko</span>
        </h1>

        <nav className="hidden md:flex">
          <ul className="flex list-none gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleClick(link.href)}
                  className={`rounded-lg px-3 py-1 text-sm font-normal transition-colors duration-500 ${
                    active === link.href
                      ? "text-[var(--c1)]"
                      : "text-[var(--text)] hover:text-[var(--c1)]"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden text-[var(--text)] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden mt-2 rounded-lg bg-[var(--complement)]/80"
        >
          <ul className="flex flex-col items-center gap-2 py-3">
            {links.map((link) => (
              <li key={link.href} className="w-full text-center">
                <button
                  onClick={() => handleClick(link.href)}
                  className={`block w-full py-2 text-sm transition-colors ${
                    active === link.href
                      ? "text-[var(--c1)]"
                      : "text-[var(--text)] hover:text-[var(--c1)]"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </motion.header>
  );
}

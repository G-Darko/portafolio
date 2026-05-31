"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";

export default function Contact() {
  const [year, setYear] = useState(2025);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <>
      <section id="contacto" className="mx-auto w-[90%] py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl rounded-xl bg-[var(--card)] p-6"
        >
          <h2 className="text-center text-2xl font-bold text-[var(--accent)]">
            Contacto | Gael Uribe
          </h2>
          <p className="mt-3 text-center text-sm">
            Si desea contactarme, puede mandar un correo por medio de este formulario
          </p>
          <form
            action="https://formspree.io/f/xlevgjee"
            method="POST"
            className="mt-5 flex flex-col gap-5"
          >
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                className="peer w-full rounded-xl border-2 border-[var(--rgba)] bg-[var(--complement)] p-4 text-lg text-[var(--text)] outline-none transition-colors focus:border-[var(--c1)]"
              />
              <label className="pointer-events-none absolute left-0 top-0 p-4 text-lg text-[var(--text)] transition-all duration-500 peer-focus:-translate-y-2 peer-focus:translate-x-5 peer-focus:bg-[var(--complement)] peer-focus:px-2.5 peer-focus:text-xs peer-focus:text-[var(--c1)] peer-focus:tracking-widest peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:translate-x-5 peer-[&:not(:placeholder-shown)]:bg-[var(--complement)] peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[var(--c1)]">
                Correo electrónico
              </label>
            </div>
            <div className="relative">
              <textarea
                name="message"
                required
                rows={4}
                className="peer w-full rounded-xl border-2 border-[var(--rgba)] bg-[var(--complement)] p-4 text-lg text-[var(--text)] outline-none transition-colors focus:border-[var(--c1)] resize-none"
              />
              <label className="pointer-events-none absolute left-0 top-0 p-4 text-lg text-[var(--text)] transition-all duration-500 peer-focus:-translate-y-2 peer-focus:translate-x-5 peer-focus:bg-[var(--complement)] peer-focus:px-2.5 peer-focus:text-xs peer-focus:text-[var(--c1)] peer-focus:tracking-widest peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:translate-x-5 peer-[&:not(:placeholder-shown)]:bg-[var(--complement)] peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[var(--c1)]">
                Mensaje
              </label>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-lg font-bold uppercase tracking-widest text-black transition-colors hover:bg-gradient-to-r hover:from-[#0df8f9] hover:to-[#0D82F9]"
            >
              <Send size={20} />
              Enviar
            </motion.button>
          </form>
        </motion.div>
      </section>

      <footer className="mt-12 border-t border-[var(--accent)] bg-[var(--card)] py-3 text-center text-lg font-bold">
        <b>{year}</b> | <span className="text-[var(--accent)]">G-Darko</span>
      </footer>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Send } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlevgjee";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactWindow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const resetStatus = () => {
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-form space-y-5">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-hud-cyan/80 uppercase md:text-sm">
          {t.contact.channel}
        </p>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.contact.desc}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-hud-border/70 bg-hud-cyan/4 p-4 shadow-[0_0_28px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-sm md:p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--hud-cyan) 8%, transparent) 2px, color-mix(in oklch, var(--hud-cyan) 8%, transparent) 4px)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div className="contact-field">
            <label htmlFor="contact-email" className="contact-label-static">
              {t.contact.email}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetStatus();
              }}
              required
              disabled={status === "sending"}
              className="contact-input"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message" className="contact-label-static">
              {t.contact.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                resetStatus();
              }}
              required
              rows={4}
              disabled={status === "sending"}
              className="contact-input"
              placeholder={t.contact.messagePlaceholder}
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
            whileTap={{ scale: status === "sending" ? 1 : 0.99 }}
            className="contact-submit flex w-full items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
          >
            <Send size={17} className="translate-x-0.5 translate-y-0.5" />
            {status === "sending" ? t.contact.sending : t.contact.send}
          </motion.button>

          {status === "success" && (
            <p className="text-center text-sm font-medium text-hud-green md:text-base">
              {t.contact.success}
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-sm font-medium text-hud-red md:text-base">
              {t.contact.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

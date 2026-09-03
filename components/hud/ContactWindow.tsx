"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch, Mail, Send } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlevgjee";
const CONTACT_EMAIL = "gdarko.uribe@gmail.com";
const GITHUB_URL = "https://github.com/G-Darko";
const MESSAGE_MAX = 2000;

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactWindow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const resetStatus = () => {
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
        signal: controller.signal,
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("error");
    }
  };

  const channelClass =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded border border-hud-border px-3 py-2 font-mono text-sm text-hud-cyan transition-colors hover:bg-hud-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-cyan";

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

      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {t.contact.channels}
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className={channelClass}>
            <Mail size={14} />
            {CONTACT_EMAIL}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={channelClass}
          >
            <GitBranch size={14} />
            GitHub
          </a>
          <a href="/cv" className={channelClass}>
            {t.profile.viewCv}
          </a>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-hud-border/70 bg-hud-cyan/4 p-4 shadow-[0_0_28px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-sm md:p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--hud-cyan) 8%, transparent) 2px, color-mix(in oklch, var(--hud-cyan) 8%, transparent) 4px)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
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
              maxLength={254}
              disabled={status === "sending"}
              className="contact-input"
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={status === "error" ? true : undefined}
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
                setMessage(e.target.value.slice(0, MESSAGE_MAX));
                resetStatus();
              }}
              required
              maxLength={MESSAGE_MAX}
              rows={4}
              disabled={status === "sending"}
              className="contact-input"
              placeholder={t.contact.messagePlaceholder}
            />
            <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
              {message.length}/{MESSAGE_MAX}
            </p>
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

          <div aria-live="polite" className="min-h-6">
            {status === "success" && (
              <p className="text-center text-sm font-medium text-hud-green md:text-base">
                {t.contact.success}
              </p>
            )}
            {status === "error" && (
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-hud-red md:text-base">{t.contact.error}</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="min-h-10 rounded border border-hud-border px-3 font-mono text-sm text-foreground transition-colors hover:bg-hud-cyan/10"
                  >
                    {t.contact.retry}
                  </button>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Portfolio contact")}&body=${encodeURIComponent(message)}`}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded border border-hud-cyan/40 px-3 font-mono text-sm text-hud-cyan transition-colors hover:bg-hud-cyan/10"
                  >
                    <Mail size={14} />
                    {t.contact.mailtoFallback}
                  </a>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

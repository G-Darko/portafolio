"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { FORMSPREE_ENDPOINT, mailtoHref } from "@/lib/data/profile";
import { playError, playSuccess } from "@/lib/audio/audio";
import HudScanlines from "./HudScanlines";

const MESSAGE_MAX = 2000;

type FormStatus = "idle" | "sending" | "success" | "error";

/**
 * The contact form (Formspree), shared by the legacy ContactWindow and the
 * Nyxheim Contact panel. Same endpoint, same states: idle / sending /
 * success (auto-resets after 4 s) / error with a mailto fallback.
 */
export default function ContactForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
        playSuccess();
        setEmail("");
        setMessage("");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        playError();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("error");
      playError();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-hud-border/70 bg-hud-cyan/4 p-4 shadow-[0_0_28px_color-mix(in_oklch,var(--hud-cyan)_12%,transparent)] backdrop-blur-sm md:p-5">
      <HudScanlines opacity={0.12} variant="token" />

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
            <p className="text-center text-base font-medium text-hud-green">
              {t.contact.success}
            </p>
          )}
          {status === "error" && (
            <div className="space-y-2 text-center">
              <p className="text-base font-medium text-hud-red">{t.contact.error}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="min-h-10 rounded border border-hud-border px-3 font-mono text-sm text-foreground transition-colors hover:bg-hud-cyan/10"
                >
                  {t.contact.retry}
                </button>
                <Link
                  href={mailtoHref({
                    subject: "Portfolio contact",
                    body: message,
                  })}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded border border-hud-cyan/40 px-3 font-mono text-sm text-hud-cyan transition-colors hover:bg-hud-cyan/10"
                >
                  <Mail size={14} />
                  {t.contact.mailtoFallback}
                </Link>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

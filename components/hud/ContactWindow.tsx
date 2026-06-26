"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Send } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlevgjee";

type FormStatus = "idle" | "sending" | "success" | "error";

const fieldLabelClass =
  "pointer-events-none absolute left-0 top-0 px-5 py-5 text-base uppercase tracking-wider text-muted-foreground transition-all duration-300 md:text-lg " +
  "peer-focus:-translate-y-2 peer-focus:translate-x-5 peer-focus:bg-card peer-focus:px-2.5 peer-focus:text-sm peer-focus:text-hud-cyan " +
  "peer-focus:border-l peer-focus:border-r peer-focus:border-hud-cyan " +
  "peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-5 peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-2.5 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-hud-cyan " +
  "peer-[:not(:placeholder-shown)]:border-l peer-[:not(:placeholder-shown)]:border-r peer-[:not(:placeholder-shown)]:border-hud-cyan";

const fieldInputClass =
  "peer w-full rounded-[10px] border-2 border-border bg-card px-5 py-5 text-base text-foreground outline-none transition-all duration-300 " +
  "focus:border-hud-cyan md:text-lg " +
  "not-placeholder-shown:border-hud-cyan";

export default function ContactWindow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

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
    <div className="contact-form flex flex-col items-center gap-6 md:gap-8">
      <p className="max-w-md text-center text-base leading-relaxed text-muted-foreground md:text-lg">
        {t.contact.desc}
      </p>

      <form onSubmit={handleSubmit} className="w-full pt-2">
        <div className="relative mb-8 w-full">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "success" || status === "error") setStatus("idle");
            }}
            required
            disabled={status === "sending"}
            className={fieldInputClass}
            placeholder=" "
          />
          <label className={fieldLabelClass}>{t.contact.email}</label>
        </div>

        <div className="relative mb-8 w-full">
          <textarea
            name="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (status === "success" || status === "error") setStatus("idle");
            }}
            required
            rows={5}
            disabled={status === "sending"}
            className={`${fieldInputClass} resize-none`}
            placeholder=" "
          />
          <label className={fieldLabelClass}>{t.contact.message}</label>
        </div>

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
          whileTap={{ scale: status === "sending" ? 1 : 0.99 }}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-base font-semibold uppercase tracking-[0.3em] text-background transition-colors hover:bg-linear-to-r hover:from-hud-cyan hover:to-hud-blue disabled:cursor-wait disabled:opacity-70 md:text-lg"
        >
          <Send size={18} className="translate-x-1 translate-y-0.5" />
          {status === "sending" ? t.contact.sending : t.contact.send}
        </motion.button>

        {status === "success" && (
          <p className="mt-4 text-center text-sm font-medium text-hud-green md:text-base">
            {t.contact.success}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-center text-sm font-medium text-hud-red md:text-base">
            {t.contact.error}
          </p>
        )}
      </form>
    </div>
  );
}

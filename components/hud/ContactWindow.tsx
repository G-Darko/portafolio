"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Mail, Phone, Send } from "lucide-react";

export default function ContactWindow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:uribemelgar19@gmail.com?subject=Portafolio Contacto&body=${encodeURIComponent(
      `De: ${email}\n\n${message}`
    )}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs opacity-70" style={{ color: "var(--accent)" }}>
        {t.contact.desc}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text)" }}>
            {t.contact.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-xs outline-none"
            style={{ borderColor: "var(--glass-border)", color: "var(--text)" }}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-widest" style={{ color: "var(--text)" }}>
            {t.contact.message}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-xs outline-none resize-none"
            style={{ borderColor: "var(--glass-border)", color: "var(--text)" }}
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1 rounded border py-2 text-[10px] font-bold tracking-widest transition-colors hover:bg-accent/10"
          style={{ borderColor: "var(--glass-border)", color: "var(--c1)" }}
        >
          <Send size={10} />
          {sent ? "✓" : t.contact.send}
        </button>
      </form>

      <div className="mt-2 space-y-1 border-t pt-2" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--accent)" }}>
          <Phone size={10} />
          <span>+52 55 5617 1692</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--accent)" }}>
          <Mail size={10} />
          <span>uribemelgar19@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

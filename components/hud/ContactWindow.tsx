"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Send } from "lucide-react";

export default function ContactWindow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:uribemelgar19@gmail.com?subject=Portafolio Contacto&body=${encodeURIComponent(`De: ${email}\n\n${message}`)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t.contact.desc}</p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="text-[10px] font-bold tracking-widest text-foreground">{t.contact.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded border border-hud-border bg-transparent px-2 py-1.5 text-xs text-foreground outline-none focus:border-hud-cyan"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-widest text-foreground">{t.contact.message}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="mt-1 w-full resize-none rounded border border-hud-border bg-transparent px-2 py-1.5 text-xs text-foreground outline-none focus:border-hud-cyan"
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1 rounded border border-hud-border py-2 text-[10px] font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
        >
          <Send size={10} />
          {sent ? "✓" : t.contact.send}
        </button>
      </form>

      <div className="mt-2 space-y-1 border-t border-hud-border pt-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>📞</span>
          <span>+52 55 5617 1692</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>✉</span>
          <span>uribemelgar19@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

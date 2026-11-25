"use client";

/**
 * LEGACY contact modal (Ronda 7 PR-2): the old `#contact` dialog — a
 * Formspree form (same endpoint the rest of the site uses) with the
 * legacy floating-label inputs. The recipient and endpoint come from
 * `lib/data/profile.ts`, never hardcoded here.
 */
import { useEffect } from "react";
import { Mail, Send, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from "@/lib/data/profile";

export default function LegacyContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[4000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t.legacy.contactTitle}
    >
      <button
        type="button"
        aria-label={t.eras.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#454546] opacity-60"
      />
      <div className="relative max-h-[90%] w-full max-w-[800px] overflow-y-auto rounded-[30px] bg-[#121212] shadow-[0_5px_15px_rgba(255,255,255,0.25)] max-md:w-[calc(100%-5px)]">
        <header className="sticky top-0 z-10">
          <div className="bg-[#222] pr-[45px]">
            <h2 className="p-2.5 text-xl font-bold text-[#66ccff]">{t.legacy.contactTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.eras.close}
            className="absolute top-[15px] right-[15px] flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f00] text-2xl text-[#f0f0f0] transition-colors hover:bg-[#f5c1bb] hover:text-[#c72f1d]"
          >
            <X size={22} aria-hidden />
          </button>
        </header>

        <section className="flex flex-col items-center justify-center gap-7 p-5">
          <p className="mt-7 text-center text-lg">{t.legacy.contactIntro}</p>
          <form action={FORMSPREE_ENDPOINT} method="POST" className="w-full pt-5">
            <div className="group relative mb-7 w-full">
              <input
                type="email"
                name="email"
                required
                placeholder=" "
                className="w-full rounded-[10px] border-2 border-white/25 bg-[#222] p-5 text-[1.3em] text-[#f0f0f0] outline-none transition-colors peer focus:border-[#0df8f9]"
              />
              <label className="pointer-events-none absolute top-5 left-0 px-5 text-[1.3em] text-[#f0f0f0] uppercase transition-all duration-500 peer-focus:translate-x-5 peer-focus:-translate-y-7 peer-focus:border-x peer-focus:border-[#0df8f9] peer-focus:bg-[#222] peer-focus:px-2.5 peer-focus:text-[0.85em] peer-focus:tracking-[0.2em] peer-focus:text-[#0df8f9] peer-[:not(:placeholder-shown)]:translate-x-5 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:border-x peer-[:not(:placeholder-shown)]:border-[#0df8f9] peer-[:not(:placeholder-shown)]:bg-[#222] peer-[:not(:placeholder-shown)]:px-2.5 peer-[:not(:placeholder-shown)]:text-[0.85em] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:text-[#0df8f9]">
                {t.legacy.emailLabel}
              </label>
            </div>
            <div className="group relative mb-7 w-full">
              <textarea
                name="message"
                required
                rows={4}
                placeholder=" "
                className="w-full resize-none rounded-[10px] border-2 border-white/25 bg-[#222] p-5 text-[1.3em] text-[#f0f0f0] outline-none transition-colors peer focus:border-[#0df8f9]"
              />
              <label className="pointer-events-none absolute top-5 left-0 px-5 text-[1.3em] text-[#f0f0f0] uppercase transition-all duration-500 peer-focus:translate-x-5 peer-focus:-translate-y-7 peer-focus:border-x peer-focus:border-[#0df8f9] peer-focus:bg-[#222] peer-focus:px-2.5 peer-focus:text-[0.85em] peer-focus:tracking-[0.2em] peer-focus:text-[#0df8f9] peer-[:not(:placeholder-shown)]:translate-x-5 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:border-x peer-[:not(:placeholder-shown)]:border-[#0df8f9] peer-[:not(:placeholder-shown)]:bg-[#222] peer-[:not(:placeholder-shown)]:px-2.5 peer-[:not(:placeholder-shown)]:text-[0.85em] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:text-[#0df8f9]">
                {t.legacy.messageLabel}
              </label>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-[10px] border-none bg-white py-2.5 text-[1.5em] font-bold tracking-[0.3em] text-[#121212] uppercase transition-colors duration-500 hover:bg-[linear-gradient(45deg,#0df8f9,#0D82F9)] hover:text-[#f0f0f0]"
            >
              <Send size={22} aria-hidden className="mr-2 inline-block translate-y-[-2px]" />
              {t.legacy.send}
            </button>
          </form>
          <p className="text-center text-sm text-[#f0f0f0]/70">
            {t.legacy.writeDirect}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1 text-[#66ccff] hover:underline">
              <Mail size={14} aria-hidden />
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

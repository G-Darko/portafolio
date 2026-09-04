"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { playHUDClick } from "@/lib/audio/audio";
import HudScanlines from "./HudScanlines";
import HudStatusDot from "./HudStatusDot";

type HudConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function HudConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: HudConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-500 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label={cancelLabel}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => {
              playHUDClick();
              onCancel();
            }}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-hud-border/80 bg-hud-bg/95 p-5 shadow-[0_0_40px_oklch(0.65_0.18_255/0.15),inset_0_1px_0_oklch(1_0_0/0.05)] backdrop-blur-xl md:p-6"
          >
            <HudScanlines opacity={0.2} />

            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <HudStatusDot color="amber" />
                <h2
                  id={titleId}
                  className="font-mono text-sm font-bold tracking-[0.18em] text-hud-cyan uppercase md:text-base"
                >
                  {title}
                </h2>
              </div>

              <p id={descId} className="text-base leading-relaxed text-muted-foreground">
                {description}
              </p>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={() => {
                    playHUDClick();
                    onCancel();
                  }}
                  className="hud-focus-ring min-h-11 rounded border border-hud-border px-4 py-2.5 font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playHUDClick();
                    onConfirm();
                  }}
                  className="min-h-11 rounded border border-hud-red/50 bg-hud-red/10 px-4 py-2.5 font-mono text-sm font-bold tracking-widest text-hud-red uppercase transition-colors hover:bg-hud-red/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud-red"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

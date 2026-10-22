"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getCertifications } from "@/lib/data/certifications";

export default function CertificationsWindow() {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();

  return (
    <div className="space-y-3">
      {getCertifications(locale).map((cert, i) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border border-hud-border bg-hud-cyan/5 p-3"
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hud-border bg-card font-mono text-sm font-bold"
              style={{ color: cert.color }}
            >
              {cert.emblem}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground md:text-base">{cert.name}</h4>
              <p className="text-sm text-muted-foreground">
                {cert.issuer} • {cert.date}
              </p>
              {cert.url && (
                <Link
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-hud-cyan transition-colors hover:opacity-80"
                >
                  <ExternalLink size={12} />
                  {t.certifications.link}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

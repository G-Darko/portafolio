"use client";

import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface CertData {
  icon: string;
  iconColor: string;
  title: string;
  org: string;
  date: string;
  link: string;
  linkText: string;
  folio?: string;
}

export default function CertificationsWindow() {
  const { t, locale } = useTranslation();

  const certs: CertData[] = [
    {
      icon: "JS",
      iconColor: "#f7df1e",
      title: t.certifications.jsEssentials.title,
      org: t.certifications.jsEssentials.org,
      date: t.certifications.jsEssentials.date,
      link: "https://www.credly.com/badges/77a5d34a-d824-42e2-a4bf-d0b498542f90/public_url",
      linkText: t.certifications.jsEssentials.link,
    },
    {
      icon: "EC",
      iconColor: "var(--c1)",
      title: t.certifications.conocer.title,
      org: t.certifications.conocer.org,
      date: t.certifications.conocer.date,
      link: "https://www.renap.edu.mx/EC0160/16955622",
      linkText: t.certifications.conocer.link,
      folio: locale === "es" ? "Folio para validar: 16955622" : "Validation folio: 16955622",
    },
  ];

  return (
    <div className="space-y-3">
      {certs.map((cert, i) => (
        <motion.div
          key={cert.icon + i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border p-3"
          style={{ borderColor: "var(--glass-border)", background: "rgba(102,204,255,0.03)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold"
              style={{
                background: "var(--card)",
                border: "1px solid var(--glass-border)",
                color: cert.iconColor,
              }}
            >
              {cert.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>
                {cert.title}
              </h4>
              <p className="text-[10px] opacity-60" style={{ color: "var(--accent)" }}>
                {cert.org} • {cert.date}
              </p>
              {cert.folio && (
                <p className="mt-1 text-[9px] opacity-50 font-mono" style={{ color: "var(--accent)" }}>
                  {cert.folio}
                </p>
              )}
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[10px] transition-colors hover:opacity-80"
                style={{ color: "var(--c1)" }}
              >
                <ExternalLink size={10} />
                {cert.linkText}
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

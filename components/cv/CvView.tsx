"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { getCvContent, type CvRole } from "@/lib/data/cv";
import { useLocaleStore } from "@/lib/store/useLocaleStore";

const SECTION_TITLE = "mb-3 border-b border-hud-border/60 pb-1 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase";
const TOOLBAR_BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded border px-4 py-2 font-mono text-sm font-bold tracking-widest transition-colors";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-8">
      <h2 id={id} className={SECTION_TITLE}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RoleBlock({ role, techLabel }: { role: CvRole; techLabel: string }) {
  return (
    <article className="mb-6">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-lg font-semibold text-foreground">
          {role.title}, <span className="font-normal text-muted-foreground">{role.org}</span>
        </h3>
        <p className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">{role.period}</p>
      </div>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed">
        {role.bullets.map((b) => (
          <li key={`${b.label}-${b.text.slice(0, 24)}`}>
            {b.label && <strong className="text-foreground">{b.label}: </strong>}
            <span className="text-muted-foreground">{b.text}</span>
          </li>
        ))}
      </ul>
      {role.tech.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{techLabel}:</span> {role.tech.join(", ")}
        </p>
      )}
    </article>
  );
}

export function CvView() {
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const content = getCvContent(locale);
  const { titles, ui } = content;
  const [busy, setBusy] = useState(false);

  const downloadPdf = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const [{ pdf }, { CvPdfDocument }] = await Promise.all([import("@react-pdf/renderer"), import("./CvPdfDocument")]);
      const blob = await pdf(<CvPdfDocument content={content} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV-Gael-Uribe-${locale}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.print();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cv-body min-h-screen bg-background text-foreground selection:bg-hud-cyan/30">
      <div className="cv-ignore-print sticky top-0 z-20 border-b border-hud-border/50 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link href="/" className={`${TOOLBAR_BUTTON} border-hud-cyan/40 text-hud-cyan hover:bg-hud-cyan/10`}>
            {ui.back}
          </Link>
          <p className="hidden font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase sm:block">{ui.brandStamp}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              className={`${TOOLBAR_BUTTON} min-w-11 border-hud-border px-3 text-muted-foreground hover:border-hud-cyan/40 hover:text-hud-cyan`}
              aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
            >
              {locale.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={busy}
              className={`${TOOLBAR_BUTTON} border-hud-cyan/50 bg-foreground font-semibold text-background hover:opacity-90 disabled:opacity-60`}
            >
              <Download size={16} aria-hidden />
              {busy ? ui.downloading : ui.download}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">{content.legalName}</h1>
            <p className="cv-ignore-print inline-flex items-center gap-2 rounded border border-hud-border/60 bg-hud-bg/60 px-3 py-1.5 font-mono text-xs tracking-[0.16em] text-hud-cyan uppercase">
              <span className="size-2 rounded-full bg-hud-green shadow-[0_0_10px_var(--hud-green)]" />
              {ui.available}
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-hud-cyan">{content.headline}</p>
          <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{content.location}</span>
            {content.contact.map((c) => (
              <span key={c.kind}>
                <span aria-hidden>| </span>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="break-all text-hud-cyan underline-offset-2 hover:underline"
                >
                  {c.label}
                </a>
              </span>
            ))}
          </p>
        </header>

        <Section id="cv-summary" title={titles.summary}>
          <p className="text-base leading-relaxed text-foreground">{content.summary}</p>
        </Section>

        <Section id="cv-experience" title={titles.experience}>
          {content.roles.map((role) => (
            <RoleBlock key={`${role.org}-${role.period}`} role={role} techLabel={ui.techLabel} />
          ))}
        </Section>

        <Section id="cv-skills" title={titles.skills}>
          <ul className="space-y-1.5 text-base">
            {content.skillGroups.map((g) => (
              <li key={g.label}>
                <strong className="text-foreground">{g.label}:</strong>{" "}
                <span className="text-muted-foreground">{g.items.join(", ")}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cv-education" title={titles.education}>
          <ul className="space-y-1.5 text-base">
            {content.education.map((ed) => (
              <li key={ed.title}>
                <strong className="text-foreground">{ed.title}</strong>
                <span className="text-muted-foreground">
                  , {ed.org} ({ed.period})
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cv-certs" title={titles.certs}>
          <ul className="space-y-1.5 text-base">
            {content.certs.map((c) => (
              <li key={c.title}>
                <strong className="text-foreground">{c.title}</strong>
                <span className="text-muted-foreground">
                  , {c.org} ({c.date}){c.folio ? `. Folio ${c.folio}` : ""}
                </span>
                {c.url && (
                  <>
                    {" "}
                    <a href={c.url} target="_blank" rel="noreferrer" className="cv-attr text-sm text-hud-cyan underline-offset-2 hover:underline">
                      {locale === "es" ? "Ver credencial" : "View credential"}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cv-languages" title={titles.languages}>
          <p className="text-base text-muted-foreground">{content.languages.join(" | ")}</p>
        </Section>
      </main>
    </div>
  );
}

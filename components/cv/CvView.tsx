"use client";

import { useState } from "react";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { Download, Globe, Mail, Phone } from "lucide-react";
import { getCvContent } from "@/lib/data/cv";
import { telHref } from "@/lib/data/profile";
import { CvPdfDocument } from "@/components/cv/CvPdfDocument";
import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { toBrowserHref } from "@/lib/hud/routes";
import GithubIcon from "../icons/GithubIcon";

export function CvView() {
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const content = getCvContent(locale);
  const [busy, setBusy] = useState(false);
  const role = content.primaryRole;

  const downloadPdf = async () => {
    if (busy) return;
    setBusy(true);
    try {
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link
            href={toBrowserHref("/")}
            className="inline-flex min-h-11 items-center rounded border border-hud-cyan/40 px-4 py-2 font-mono text-sm font-bold tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10"
          >
            {content.backLabel}
          </Link>
          <p className="hidden font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase sm:block">
            {content.brandStamp}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-hud-border px-3 font-mono text-sm font-bold tracking-widest text-muted-foreground transition-colors hover:border-hud-cyan/40 hover:text-hud-cyan"
              aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
            >
              {locale.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 rounded border border-hud-cyan/50 bg-foreground px-4 py-2 font-mono text-sm font-semibold tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Download size={16} aria-hidden />
              {busy ? content.downloadingLabel : content.downloadLabel}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-6xl flex-col px-4 py-8 md:px-8 md:py-10">
        <header className="relative mb-8 border-b border-hud-border/60 pb-8 md:mb-10 md:pb-10">
          <div className="max-w-3xl">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {content.legalName}
            </h1>
            <p className="mt-3 font-mono text-sm font-bold tracking-[0.18em] text-hud-cyan uppercase md:text-base">
              {content.role}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.blurb}
            </p>
          </div>
          <div className="cv-ignore-print mt-6 inline-flex items-center gap-2 rounded border border-hud-border/60 bg-hud-bg/60 px-3 py-2 font-mono text-xs tracking-[0.16em] text-hud-cyan uppercase md:absolute md:top-0 md:right-0 md:mt-0">
            <span className="size-2 rounded-full bg-hud-green shadow-[0_0_10px_var(--hud-green)]" />
            {content.availableLabel}
          </div>
        </header>

        <section className="mb-8 md:mb-10" aria-labelledby="cv-experience">
          <h2
            id="cv-experience"
            className="mb-5 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase"
          >
            {content.experienceTitle}
          </h2>

          <article className="rounded-lg border border-hud-border/50 bg-hud-bg/40 p-5 md:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4">
              <h3 className="text-lg font-semibold text-foreground md:text-xl">
                {role.title}
                <span className="font-normal text-muted-foreground"> — {role.org}</span>
              </h3>
              <p className="font-mono text-xs tabular-nums text-muted-foreground md:text-sm">
                {role.period}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {role.summary}
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed md:text-base">
              {role.bullets.map((b) => (
                <li key={b.label}>
                  <strong className="text-foreground">{b.label}:</strong>{" "}
                  <span className="text-muted-foreground">{b.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {role.tech.map((t) => (
                <span
                  key={t}
                  className="rounded border border-hud-border/50 bg-hud-cyan/5 px-2 py-0.5 font-mono text-xs tracking-wide text-hud-cyan"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>

          <div className="mt-6">
            <h3 className="mb-3 font-mono text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
              {content.priorTitle}
            </h3>
            <ul className="space-y-4">
              {content.priorRoles.map((job) => (
                <li
                  key={`${job.org}-${job.period}`}
                  className="border-l border-hud-border/40 pl-4"
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                      <span className="font-normal text-muted-foreground"> — {job.org}</span>
                    </p>
                    <p className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {job.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {job.description}
                  </p>
                  <p className="mt-1 font-mono text-xs text-hud-cyan/80">{job.tech.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-auto grid flex-1 gap-6 border-t border-hud-border/40 pt-8 md:grid-cols-3 md:gap-8">
          <section aria-labelledby="cv-skills">
            <h2
              id="cv-skills"
              className="mb-4 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase"
            >
              {content.skillsTitle}
            </h2>
            <ul className="space-y-3">
              {content.skillGroups.map((g) => (
                <li key={g.label}>
                  <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                    {g.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{g.items.join(", ")}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {content.softSkillsTitle}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              {content.softSkills.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cv-education">
            <h2
              id="cv-education"
              className="mb-4 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase"
            >
              {content.educationTitle}
            </h2>
            <ul className="space-y-4">
              {content.education.map((ed) => (
                <li key={ed.title}>
                  <p className="text-sm font-semibold text-foreground">{ed.title}</p>
                  <p className="text-sm text-muted-foreground">{ed.org}</p>
                  <p className="font-mono text-xs text-muted-foreground">{ed.period}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 mb-3 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase">
              {content.certsTitle}
            </h3>
            <ul className="space-y-3">
              {content.certs.map((c) => (
                <li key={c.title}>
                  <p className="text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.org} · {c.date}
                  </p>
                  {c.folio && (
                    <p className="font-mono text-xs text-muted-foreground">Folio: {c.folio}</p>
                  )}
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="cv-attr text-sm text-hud-cyan underline-offset-2 hover:underline"
                    >
                      {locale === "es" ? "Ver credencial" : "View credential"}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cv-contact">
            <h2
              id="cv-contact"
              className="mb-4 font-mono text-sm font-bold tracking-[0.2em] text-hud-cyan uppercase"
            >
              {content.contactTitle}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`mailto:${content.contact.email}`}
                  className="flex items-center gap-2 break-all text-hud-cyan underline-offset-2 hover:underline"
                >
                  <Mail size={16} aria-hidden />
                  <span className="break-all">{content.contact.email}</span>
                </Link>
              </li>
              <li>
                <a
                  href={telHref(content.contact.phone)}
                  className="flex items-center gap-2 break-all text-hud-cyan underline-offset-2 hover:underline"
                >
                  <Phone size={16} aria-hidden />
                  <span className="break-all">{content.contact.phone}</span>
                </a>
              </li>
              <li>
                <Link
                  href={content.contact.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 break-all text-hud-cyan underline-offset-2 hover:underline"
                >
                  <Globe size={16} aria-hidden />
                  <span className="break-all">{content.contact.site}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={content.contact.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 break-all text-hud-cyan underline-offset-2 hover:underline"
                >
                  <GithubIcon size={16} aria-hidden />
                  <span className="break-all">{content.contact.github}</span>
                </Link>
              </li>
            </ul>
            <p className="mt-6 font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {content.languagesTitle}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {content.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

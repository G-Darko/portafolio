"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { GitBranch, Mail } from "lucide-react";
import {
  CONTACT_EMAIL,
  CV_PATH,
  GITHUB_URL,
  mailtoHref,
} from "@/lib/data/profile";
import HudOutlineLink from "./HudOutlineLink";
import ContactForm from "./ContactForm";

export default function ContactWindow() {
  const { t } = useTranslation();

  return (
    <div className="contact-form space-y-5">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-hud-cyan uppercase md:text-sm">
          {t.contact.channel}
        </p>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.contact.desc}
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {t.contact.channels}
        </p>
        <div className="flex flex-wrap gap-2">
          <HudOutlineLink href={mailtoHref()} tone="cyan">
            <Mail size={14} />
            {CONTACT_EMAIL}
          </HudOutlineLink>
          <HudOutlineLink href={GITHUB_URL} external tone="cyan">
            <GitBranch size={14} />
            GitHub
          </HudOutlineLink>
          <HudOutlineLink href={CV_PATH} tone="cyan">
            {t.profile.viewCv}
          </HudOutlineLink>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}

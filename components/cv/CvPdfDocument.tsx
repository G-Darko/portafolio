import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Svg,
  Path,
} from "@react-pdf/renderer";
import type { CvContent } from "@/lib/data/cv";
import { telHref } from "@/lib/data/profile";

const ICON = "#0a5c66";

function MailIcon() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={ICON}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M22 6l-10 7L2 6" stroke={ICON} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={ICON}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

function GlobeIcon() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        stroke={ICON}
        strokeWidth={2}
        fill="none"
      />
      <Path d="M2 12h20" stroke={ICON} strokeWidth={2} fill="none" />
      <Path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={ICON}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

function GithubPdfIcon() {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
        fill={ICON}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111111",
    backgroundColor: "#ffffff",
    flexDirection: "column",
  },
  masthead: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#111111",
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  role: {
    fontSize: 10,
    color: "#333333",
    marginBottom: 6,
  },
  blurb: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#333333",
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 10,
    color: "#111111",
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  jobMeta: {
    fontSize: 8,
    color: "#555555",
    marginBottom: 4,
  },
  summary: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#333333",
    marginBottom: 5,
  },
  bullet: {
    fontSize: 8,
    lineHeight: 1.38,
    color: "#333333",
    marginBottom: 4,
    paddingLeft: 6,
  },
  techLine: {
    fontSize: 7.5,
    color: "#555555",
    marginTop: 3,
    marginBottom: 6,
  },
  priorBlock: {
    marginBottom: 7,
  },
  priorTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  priorMeta: {
    fontSize: 7.5,
    color: "#666666",
    marginBottom: 2,
  },
  priorBody: {
    fontSize: 8,
    lineHeight: 1.35,
    color: "#333333",
  },
  priorTech: {
    fontSize: 7,
    color: "#555555",
    marginTop: 2,
  },
  bottomGrid: {
    flexDirection: "row",
    marginTop: 8,
    gap: 14,
    flexGrow: 1,
  },
  bottomCol: {
    flex: 1,
  },
  groupLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    marginBottom: 2,
    color: "#111111",
  },
  muted: {
    fontSize: 8,
    color: "#444444",
    lineHeight: 1.35,
    marginBottom: 2,
  },
  softItem: {
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.35,
    marginBottom: 2,
    paddingLeft: 4,
  },
  link: {
    fontSize: 8,
    color: "#0a5c66",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    textDecoration: "none",
  },
});

export function CvPdfDocument({ content }: { content: CvContent }) {
  const role = content.primaryRole;

  return (
    <Document
      title={`${content.legalName} — CV`}
      author={content.legalName}
      subject={content.role}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.masthead}>
          <Text style={styles.name}>{content.legalName}</Text>
          <Text style={styles.role}>{content.role}</Text>
          <Text style={styles.blurb}>{content.blurb}</Text>
        </View>

        <Text style={styles.sectionTitle}>{content.experienceTitle}</Text>
        <Text style={styles.jobTitle}>
          {role.title} — {role.org}
        </Text>
        <Text style={styles.jobMeta}>{role.period}</Text>
        <Text style={styles.summary}>{role.summary}</Text>
        {role.bullets.map((b) => (
          <Text key={b.label} style={styles.bullet}>
            • {b.label}: {b.text}
          </Text>
        ))}
        <Text style={styles.techLine}>{role.tech.join(" · ")}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>{content.priorTitle}</Text>
        {content.priorRoles.map((job) => (
          <View key={`${job.org}-${job.period}`} style={styles.priorBlock} wrap={false}>
            <Text style={styles.priorTitle}>
              {job.title} — {job.org}
            </Text>
            <Text style={styles.priorMeta}>{job.period}</Text>
            <Text style={styles.priorBody}>{job.description}</Text>
            <Text style={styles.priorTech}>{job.tech.join(" · ")}</Text>
          </View>
        ))}

        <View style={styles.bottomGrid}>
          <View style={styles.bottomCol}>
            <Text style={styles.sectionTitle}>{content.skillsTitle}</Text>
            {content.skillGroups.map((g) => (
              <View key={g.label}>
                <Text style={styles.groupLabel}>{g.label}</Text>
                <Text style={styles.muted}>{g.items.join(", ")}</Text>
              </View>
            ))}
            <Text style={[styles.groupLabel, { marginTop: 8 }]}>{content.softSkillsTitle}</Text>
            {content.softSkills.map((item) => (
              <Text key={item} style={styles.softItem}>
                • {item}
              </Text>
            ))}
          </View>

          <View style={styles.bottomCol}>
            <Text style={styles.sectionTitle}>{content.educationTitle}</Text>
            {content.education.map((ed) => (
              <View key={ed.title} style={{ marginBottom: 6 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8 }}>{ed.title}</Text>
                <Text style={styles.muted}>{ed.org}</Text>
                <Text style={styles.muted}>{ed.period}</Text>
              </View>
            ))}
            <Text style={[styles.sectionTitle, { marginTop: 4 }]}>{content.certsTitle}</Text>
            {content.certs.map((c) => (
              <View key={c.title} style={{ marginBottom: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8 }}>{c.title}</Text>
                <Text style={styles.muted}>
                  {c.org} · {c.date}
                </Text>
                {c.folio && (
                  <Text style={styles.muted}>Folio: {c.folio}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.bottomCol}>
            <Text style={styles.sectionTitle}>{content.contactTitle}</Text>
            <Link src={`mailto:${content.contact.email}`} style={styles.contactRow}>
              <MailIcon />
              <Text style={styles.link}>{content.contact.email}</Text>
            </Link>
            <Link src={telHref(content.contact.phone)} style={styles.contactRow}>
              <PhoneIcon />
              <Text style={styles.link}>{content.contact.phone}</Text>
            </Link>
            <Link src={content.contact.siteUrl} style={styles.contactRow}>
              <GlobeIcon />
              <Text style={styles.link}>{content.contact.site}</Text>
            </Link>
            <Link src={content.contact.githubUrl} style={styles.contactRow}>
              <GithubPdfIcon />
              <Text style={styles.link}>{content.contact.github}</Text>
            </Link>
            <Text style={[styles.groupLabel, { marginTop: 10 }]}>{content.languagesTitle}</Text>
            {content.languages.map((lang) => (
              <Text key={lang} style={styles.muted}>
                {lang}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

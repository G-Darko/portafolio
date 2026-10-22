import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvContent, CvRole } from "@/lib/data/cv";

/**
 * ATS-friendly PDF: one column, standard headings, real selectable text (no icons standing in for words,
 * no images, no layout tables). Visual hierarchy comes from size/weight only.
 */
const styles = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 34, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 9.5, color: "#111111", lineHeight: 1.35 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  headline: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#0a5c66", marginTop: 3 },
  contact: { fontSize: 9, color: "#333333", marginTop: 5 },
  link: { color: "#0a5c66", textDecoration: "none" },
  section: { marginTop: 11 },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingBottom: 2,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
  },
  text: { fontSize: 9.5, color: "#222222" },
  roleHead: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  roleTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  rolePeriod: { fontSize: 9, color: "#444444" },
  bulletRow: { flexDirection: "row", marginTop: 2.5, paddingLeft: 4 },
  bulletDot: { width: 9, fontSize: 9.5 },
  bulletText: { flex: 1, fontSize: 9.5, color: "#222222" },
  bold: { fontFamily: "Helvetica-Bold", color: "#111111" },
  tech: { fontSize: 8.5, color: "#444444", marginTop: 3 },
  item: { marginTop: 3 },
});

function Role({ role, techLabel }: { role: CvRole; techLabel: string }) {
  return (
    <View style={{ marginBottom: 6 }} wrap={role.bullets.length > 3}>
      <View style={styles.roleHead}>
        <Text style={styles.roleTitle}>
          {role.title}, {role.org}
        </Text>
        <Text style={styles.rolePeriod}>{role.period}</Text>
      </View>
      {role.bullets.map((b) => (
        <View key={`${b.label}-${b.text.slice(0, 24)}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            {b.label ? <Text style={styles.bold}>{b.label}: </Text> : null}
            {b.text}
          </Text>
        </View>
      ))}
      {role.tech.length > 0 && (
        <Text style={styles.tech}>
          {techLabel}: {role.tech.join(", ")}
        </Text>
      )}
    </View>
  );
}

export function CvPdfDocument({ content }: { content: CvContent }) {
  const { titles } = content;
  return (
    <Document title={`${content.legalName} - CV`} author={content.legalName} subject={content.headline} keywords={content.skillGroups.flatMap((g) => g.items).join(", ")}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{content.legalName}</Text>
        <Text style={styles.headline}>{content.headline}</Text>
        <Text style={styles.contact}>
          {content.location}
          {content.contact.map((c) => (
            <Text key={c.kind}>
              {" | "}
              <Link src={c.href} style={styles.link}>
                {c.label}
              </Link>
            </Text>
          ))}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{titles.summary}</Text>
          <Text style={styles.text}>{content.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{titles.experience}</Text>
          {content.roles.map((role) => (
            <Role key={`${role.org}-${role.period}`} role={role} techLabel={content.ui.techLabel} />
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{titles.skills}</Text>
          {content.skillGroups.map((g) => (
            <Text key={g.label} style={styles.item}>
              <Text style={styles.bold}>{g.label}: </Text>
              {g.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{titles.education}</Text>
          {content.education.map((ed) => (
            <Text key={ed.title} style={styles.item}>
              <Text style={styles.bold}>{ed.title}</Text>, {ed.org} ({ed.period})
            </Text>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{titles.certs}</Text>
          {content.certs.map((c) => (
            <Text key={c.title} style={styles.item}>
              <Text style={styles.bold}>{c.title}: </Text>
              {c.org} · {c.date}
            </Text>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{titles.languages}</Text>
          <Text style={styles.text}>{content.languages.join(" | ")}</Text>
        </View>
      </Page>
    </Document>
  );
}

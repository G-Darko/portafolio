export type CertificationId = "jsEssentials" | "conocer";

export interface CertificationMeta {
  id: CertificationId;
  icon: string;
  iconColor: string;
  url: string;
  folio?: string;
}

export const CERTIFICATIONS: CertificationMeta[] = [
  {
    id: "jsEssentials",
    icon: "JS",
    iconColor: "#f7df1e",
    url: "https://www.credly.com/badges/77a5d34a-d824-42e2-a4bf-d0b498542f90/public_url",
  },
  {
    id: "conocer",
    icon: "EC",
    iconColor: "var(--hud-cyan)",
    url: "https://www.renap.edu.mx/EC0160/16955622",
    folio: "16955622",
  },
];

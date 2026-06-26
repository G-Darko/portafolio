export type HudPaletteId =
  | "default"
  | "skool"
  | "ocean"
  | "lavender"
  | "rose"
  | "mint"
  | "sunset"
  | "neon"
  | "crimson"
  | "gold"
  | "ice"
  | "violet";

export interface HudPaletteMeta {
  id: HudPaletteId;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  swatch: string;
}

export const HUD_PALETTES: HudPaletteMeta[] = [
  {
    id: "default",
    name: "G-Darko",
    nameEn: "G-Darko",
    description: "Cian holográfico — tema original del HUD",
    descriptionEn: "Holographic cyan — original HUD theme",
    swatch: "oklch(0.75 0.18 195)",
  },
  {
    id: "skool",
    name: "Skool",
    nameEn: "Skool",
    description: "Azul eléctrico del LMS",
    descriptionEn: "Electric blue from the LMS",
    swatch: "oklch(0.731 0.159 238)",
  },
  {
    id: "ocean",
    name: "Océano",
    nameEn: "Ocean",
    description: "Azules profundos y frescos",
    descriptionEn: "Deep, cool blues",
    swatch: "oklch(0.62 0.16 240)",
  },
  {
    id: "lavender",
    name: "Lavanda",
    nameEn: "Lavender",
    description: "Púrpura suave futurista",
    descriptionEn: "Soft futuristic purple",
    swatch: "oklch(0.68 0.14 300)",
  },
  {
    id: "rose",
    name: "Rosa",
    nameEn: "Rose",
    description: "Rosa moderno con brillo",
    descriptionEn: "Modern pink glow",
    swatch: "oklch(0.72 0.16 350)",
  },
  {
    id: "mint",
    name: "Menta",
    nameEn: "Mint",
    description: "Verde menta limpio",
    descriptionEn: "Clean mint green",
    swatch: "oklch(0.74 0.14 155)",
  },
  {
    id: "sunset",
    name: "Atardecer",
    nameEn: "Sunset",
    description: "Ámbar y melocotón cálido",
    descriptionEn: "Warm amber and peach",
    swatch: "oklch(0.78 0.16 55)",
  },
  {
    id: "neon",
    name: "Neón",
    nameEn: "Neon",
    description: "Verde matrix de alto contraste",
    descriptionEn: "High-contrast matrix green",
    swatch: "oklch(0.82 0.22 145)",
  },
  {
    id: "crimson",
    name: "Carmesí",
    nameEn: "Crimson",
    description: "Rojo táctico de alerta",
    descriptionEn: "Tactical alert red",
    swatch: "oklch(0.62 0.22 25)",
  },
  {
    id: "gold",
    name: "Oro",
    nameEn: "Gold",
    description: "Dorado premium y elegante",
    descriptionEn: "Premium elegant gold",
    swatch: "oklch(0.78 0.14 85)",
  },
  {
    id: "ice",
    name: "Hielo",
    nameEn: "Ice",
    description: "Cian frío minimalista",
    descriptionEn: "Minimalist cold cyan",
    swatch: "oklch(0.82 0.06 210)",
  },
  {
    id: "violet",
    name: "Violeta",
    nameEn: "Violet",
    description: "Púrpura cyber profundo",
    descriptionEn: "Deep cyber purple",
    swatch: "oklch(0.58 0.2 275)",
  },
];
export const DEFAULT_PALETTE_ID: HudPaletteId = "default";

export function getPaletteMeta(id: HudPaletteId): HudPaletteMeta {
  return HUD_PALETTES.find((p) => p.id === id) ?? HUD_PALETTES[0];
}

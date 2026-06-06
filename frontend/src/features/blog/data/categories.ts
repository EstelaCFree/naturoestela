export type CategoryConfig = {
  label: string;
  color: string;
  image: string;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  aromaterapia: {
    label: "Aromaterapia",
    color: "#7c9e6f",
    image: "/assets/cat-aromaterapia.jpg",
  },
  "salud-natural": {
    label: "Salud Natural",
    color: "#1a5e5c",
    image: "/assets/cat-salud-natural.jpg",
  },
  neurodivergencia: {
    label: "Neurodivergencia",
    color: "#a09ac2",
    image: "/assets/cat-neurodivergencia.jpg",
  },
  "salud-digestiva": {
    label: "Salud Digestiva",
    color: "#d29649",
    image: "/assets/cat-salud-digestiva.jpg",
  },
  alimentacion: {
    label: "Alimentación",
    color: "#c0715a",
    image: "/assets/cat-alimentacion.jpg",
  },
  // Post category slugs (from API) that map to badge colours
  fitoterapia: {
    label: "Fitoterapia",
    color: "#1a5e5c",
    image: "/assets/cat-salud-natural.jpg",
  },
  "salud-integrativa": {
    label: "Salud Integrativa",
    color: "#d29649",
    image: "/assets/cat-salud-digestiva.jpg",
  },
};

export const FILTER_CATEGORIES = [
  "aromaterapia",
  "salud-natural",
  "neurodivergencia",
  "salud-digestiva",
  "alimentacion",
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];

export function getCategoryConfig(
  category: string,
): CategoryConfig | undefined {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_CONFIG[slug];
}

export type ProductStatus = "available" | "coming-soon" | "in-development";

export type Product = {
  id: string;
  title: string;
  type: "course" | "book";
  description: string;
  status: ProductStatus;
};

export const statusLabels: Record<ProductStatus, string> = {
  available: "Disponible",
  "coming-soon": "Próximamente",
  "in-development": "En desarrollo",
};

export const statusColors: Record<ProductStatus, string> = {
  available: "bg-green-100 text-green-800",
  "coming-soon": "bg-amber-100 text-amber-800",
  "in-development": "bg-gray-100 text-gray-600",
};

export const products: Product[] = [
  {
    id: "fundamentos-fitoterapia",
    title: "Fundamentos de Fitoterapia",
    type: "course",
    description:
      "Aprende los principios esenciales de la fitoterapia y cómo aplicar las plantas medicinales en el día a día.",
    status: "available",
  },
  {
    id: "nutricion-integrativa",
    title: "Nutrición Integrativa",
    type: "course",
    description:
      "Un enfoque integrador de la nutrición que va más allá de las calorías para entender la relación entre alimentos y bienestar.",
    status: "coming-soon",
  },
  {
    id: "camino-equilibrio",
    title: "El Camino del Equilibrio",
    type: "book",
    description:
      "Una guía práctica para encontrar el equilibrio físico, mental y emocional a través de terapias naturales.",
    status: "available",
  },
  {
    id: "neurodivergencia-bienestar",
    title: "Neurodivergencia y Bienestar",
    type: "book",
    description:
      "Estrategias naturales y holísticas adaptadas a las necesidades únicas de las personas neurodivergentes.",
    status: "in-development",
  },
];

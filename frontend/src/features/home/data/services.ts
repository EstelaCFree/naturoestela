export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const services: Service[] = [
  {
    id: "naturopatia",
    title: "Naturopatía",
    description:
      "Visión holística de la salud que combina terapias naturales y hábitos de vida para recuperar el equilibrio del organismo.",
    icon: "🌿",
  },
  {
    id: "aromaterapia",
    title: "Aromaterapia",
    description:
      "Uso terapéutico de aceites esenciales para promover el bienestar físico, emocional y mental.",
    icon: "🌸",
  },
  {
    id: "tic",
    title: "TIC",
    description:
      "Técnicas de Integración Cerebral para trabajar patrones emocionales y mejorar la regulación del sistema nervioso.",
    icon: "🧠",
  },
  {
    id: "tecnicas-manuales",
    title: "Técnicas manuales",
    description:
      "Masajes zen y otras técnicas manuales para liberar tensiones, mejorar la circulación y recuperar el bienestar corporal.",
    icon: "🤲",
  },
];

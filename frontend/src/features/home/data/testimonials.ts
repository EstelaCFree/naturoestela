export type Testimonial = {
  id: string;
  author: string;
  initials: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "maria-l",
    author: "María L.",
    initials: "ML",
    text: "Después de años buscando respuestas, finalmente encontré un espacio donde me escucharon de verdad. El enfoque holístico cambió mi perspectiva sobre mi salud.",
  },
  {
    id: "carlos-m",
    author: "Carlos M.",
    initials: "CM",
    text: "Como persona neurodivergente, encontré un espacio seguro y adaptado a mis necesidades. Por primera vez siento que el acompañamiento está pensado para mí.",
  },
  {
    id: "ana-s",
    author: "Ana S.",
    initials: "AS",
    text: "La combinación de ciencia y tradición que ofrece Estela es única. He mejorado mi energía, mi sueño y mi equilibrio hormonal de forma natural.",
  },
];

export const ratingStats = {
  total: 502,
  positive: 487,
  neutral: 13,
  negative: 2,
};

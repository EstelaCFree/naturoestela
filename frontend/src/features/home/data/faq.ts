export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "que-es-naturopatia",
    question: "¿Qué es la naturopatía?",
    answer:
      "La naturopatía es una disciplina de salud que utiliza terapias naturales —como la fitoterapia, la nutrición, la aromaterapia y las técnicas manuales— para estimular la capacidad autocurativa del organismo y restaurar el equilibrio físico, mental y emocional.",
  },
  {
    id: "duracion-consulta",
    question: "¿Cuánto dura una consulta?",
    answer:
      "La primera consulta dura aproximadamente 90 minutos, ya que necesitamos explorar tu historial de salud en profundidad. Las consultas de seguimiento suelen durar entre 45 y 60 minutos.",
  },
  {
    id: "neurodivergencia",
    question: "¿Trabajas con personas neurodivergentes?",
    answer:
      "Sí, es uno de mis enfoques especializados. Trabajo con personas con TDAH, autismo, dislexia y otras formas de neurodivergencia, adaptando cada protocolo a las necesidades y características individuales de cada persona.",
  },
  {
    id: "combinacion-medicina",
    question: "¿Puedo combinar tus tratamientos con medicina convencional?",
    answer:
      "Absolutamente. La naturopatía es complementaria, no sustitutiva de la medicina convencional. Siempre trabajo en coordinación con los tratamientos médicos que puedas estar siguiendo y te pido que informes a tu médico de los cambios que hagamos.",
  },
  {
    id: "consultas-online",
    question: "¿Ofreces consultas online?",
    answer:
      "Sí, ofrezco consultas tanto presenciales como online. Las consultas online son igual de efectivas para la mayoría de los casos y te permiten acceder a mis servicios desde cualquier lugar.",
  },
  {
    id: "tecnicas",
    question: "¿Qué técnicas utilizas?",
    answer:
      "Mi enfoque integra naturopatía, fitoterapia, aromaterapia, Técnicas de Integración Cerebral (TIC), técnicas manuales y masaje zen, junto con orientación nutricional y de estilo de vida. Cada sesión se personaliza según tus necesidades específicas.",
  },
];

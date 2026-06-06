import { LogoWatermark } from "./LogoWatermark";

const services = [
  {
    title: "Naturopatía",
    description:
      "Visión holística de la salud. Protocolo integral personalizado: hábitos de vida, dieta y suplementación natural.",
    image:
      "https://images.unsplash.com/photo-1615152387690-e2690878b3fd?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "Aromaterapia",
    description:
      "Aceites esenciales para promover beneficios en salud, bienestar, belleza o ámbito emocional. Formulación personalizada.",
    image:
      "https://images.unsplash.com/photo-1779956510655-7cafb6a488d5?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "TIC",
    description:
      "Técnicas de Integración Cerebral para gestionar emociones bloqueadas y momentos traumáticos. Sin hipnosis.",
    image:
      "https://images.unsplash.com/photo-1602031241963-da61dd55e765?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "Técnicas manuales",
    description:
      "Masajes con aromaterapia, experiencia ZEN, masaje metamórfico y bioactivador neurológico. Solo presencial.",
    image:
      "https://images.unsplash.com/photo-1770573318791-510ad9e11391?w=600&h=800&fit=crop&auto=format",
  },
];

export function Services() {
  return (
    <section
      id="servicios"
      className="py-24 lg:py-32 bg-warm-ivory relative overflow-hidden"
    >
      <LogoWatermark side="left" top="33%" rotation={12} size={1000} />
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Servicios
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light tracking-tight">
            Cómo puedo ayudarte
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-light-cream rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-lavender-elegant mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

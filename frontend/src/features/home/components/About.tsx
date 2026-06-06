import { LogoWatermark } from "./LogoWatermark";

const features = [
  {
    id: "experiencia",
    title: "Experiencia",
    description:
      "Más de 18 años acompañando personas en su camino hacia el equilibrio a través de terapias naturales.",
  },
  {
    id: "holistico",
    title: "Enfoque Holístico",
    description:
      "Sesiones personalizadas que contemplan el ser desde una visión integral: cuerpo, mente y emoción.",
  },
  {
    id: "tradicion",
    title: "Medicinas Tradicionales",
    description:
      "Integración de la sabiduría de la medicina europea y ayurvédica con el rigor de la ciencia actual.",
  },
  {
    id: "acompanamiento",
    title: "Acompañamiento",
    description:
      "Un proceso individualizado hacia el equilibrio, adaptado a tu esencia y circunstancias únicas.",
  },
];

export function About() {
  return (
    <section
      id="sobre-mi"
      className="py-24 lg:py-32 bg-light-cream relative overflow-hidden"
    >
      <LogoWatermark side="right" top="10%" rotation={-15} size={900} />
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo — irregular organic shape */}
          <div className="flex justify-center order-2 lg:order-1">
            <div
              className="relative w-72 lg:w-96 aspect-[3/4] overflow-hidden"
              style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
            >
              <img
                src="/assets/Estela1.jpg"
                alt="Estela Castro, naturópata"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6 order-1 lg:order-2">
            <p className="text-sm tracking-widest text-lavender-elegant/70 uppercase font-medium">
              Sobre mí
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light leading-tight">
              Estela Castro
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Soy Estela, naturópata con más de 18 años de experiencia. Me
              especializo en acompañar a personas que buscan recuperar su
              bienestar a través de un enfoque integrador que combina ciencia y
              tradición.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Mi práctica está especialmente orientada al acompañamiento de
              personas neurodivergentes, creando espacios seguros donde cada
              proceso es único y respetado en su totalidad.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-foreground/10">
              {features.map((f) => (
                <div key={f.id} className="space-y-1">
                  <h3 className="font-medium text-foreground text-sm">
                    {f.title}
                  </h3>
                  <p className="text-xs text-taupe leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

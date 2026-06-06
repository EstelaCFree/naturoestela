import { LogoWatermark } from "@/features/home/components/LogoWatermark";

export function AboutIntro() {
  return (
    <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
      <LogoWatermark side="right" top="0%" size={700} opacity={0.04} />
      <div className="mx-auto max-w-4xl px-6 lg:px-12 relative z-10">
        <p className="text-sm font-medium tracking-[0.1em] uppercase text-lavender-elegant mb-4">
          Naturópata y aromaterapéuta
        </p>
        <h2 className="font-serif font-light text-4xl lg:text-5xl text-foreground mb-10 leading-tight">
          Hola. Soy Estela Castro.
        </h2>
        <div className="space-y-5 text-taupe text-base lg:text-[1.05rem] leading-relaxed max-w-3xl">
          <p>
            Llevo 18 años dedicada a las terapias naturales o complementarias,
            como terapeuta pero también como docente. Me gustaría hablarte un
            poco más de mí, de qué es lo que hago, y espero que te ayude a
            decidir si puedo ayudarte a encontrar el equilibrio, a entender qué
            está pasando en tu organismo, a organizar tu dieta o a saber si una
            suplementación es adecuada para ti.
          </p>
          <p>
            Entre los servicios que ofrezco tengo diferentes tipos de sesiones
            para adaptarme a tus necesidades, siempre desde un punto de vista
            integral y holístico. Mi forma de trabajar es integrativa,
            aprovechando todo lo que nos ofrece la ciencia y el conocimiento
            ancestral de las distintas medicinas tradicionales naturales
            (europea y ayurvédica sobre todo).
          </p>
          <p>
            Sea con mi asesoramiento, con los cursos o mi libro, espero poder
            serte útil y acompañarte en el camino hacia el equilibrio y la
            salud.
          </p>
        </div>
      </div>
    </section>
  );
}

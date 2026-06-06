import { LogoWatermark } from "./LogoWatermark";
import { ratingStats, testimonials } from "../data/testimonials";

export function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-24 lg:py-32 bg-light-cream relative overflow-hidden"
    >
      <LogoWatermark side="right" top="20%" rotation={20} size={800} />
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Testimonios
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light mb-8">
            Lo que dicen quienes me conocen
          </h2>

          {/* Rating stats with emoji faces */}
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl" role="img" aria-label="Positivo">
                😊
              </span>
              <p className="text-3xl font-light text-foreground">
                {ratingStats.positive}
              </p>
              <p className="text-taupe text-sm">positivas</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl" role="img" aria-label="Neutral">
                😐
              </span>
              <p className="text-3xl font-light text-foreground">
                {ratingStats.neutral}
              </p>
              <p className="text-taupe text-sm">neutras</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl" role="img" aria-label="Negativo">
                😔
              </span>
              <p className="text-3xl font-light text-foreground">
                {ratingStats.negative}
              </p>
              <p className="text-taupe text-sm">negativas</p>
            </div>
          </div>
          <p className="text-taupe text-sm mt-2">
            De un total de {ratingStats.total} valoraciones
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-warm-ivory rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lavender-elegant/20 flex items-center justify-center text-sm font-medium text-lavender-elegant">
                  {t.initials}
                </div>
                <span className="font-medium text-foreground">{t.author}</span>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm">
                "{t.text}"
              </p>
              <span
                className="text-xl"
                role="img"
                aria-label="Valoración positiva"
              >
                😊
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <a
            href="/testimonios"
            className="inline-flex items-center justify-center px-8 py-3 bg-forest-green text-white text-sm font-medium tracking-wide rounded-sm hover:opacity-90 transition-opacity"
          >
            Ver todos
          </a>
          <a
            href="/testimonios/nuevo"
            className="inline-flex items-center justify-center px-8 py-3 bg-forest-green text-white text-sm font-medium tracking-wide rounded-sm hover:opacity-90 transition-opacity"
          >
            Deja el tuyo
          </a>
        </div>
      </div>
    </section>
  );
}

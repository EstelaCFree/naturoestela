import { Play } from "lucide-react";

// TODO (pre-deploy): replace placeholder with the real presentation video embed
export function AboutVideo() {
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <h2 className="font-serif font-light text-3xl lg:text-4xl text-lavender-elegant text-center tracking-tight mb-8">
          ¿Quién soy y qué hago?
        </h2>
        <div className="bg-warm-ivory rounded-sm overflow-hidden shadow-lg flex items-center justify-center h-[450px]">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/90 rounded-full shadow-xl size-20 flex items-center justify-center">
              <Play size={32} className="text-foreground/80 ml-1" />
            </div>
            <span className="text-base font-medium text-foreground/80">
              Vídeo de presentación
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

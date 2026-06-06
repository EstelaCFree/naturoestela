import { NewsletterForm } from "@/features/newsletter/components/NewsletterForm";

export function Newsletter() {
  return (
    <section id="newsletter" className="py-24 lg:py-32 bg-lavender-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center space-y-6">
        <p className="text-sm tracking-widest text-lavender-elegant/70 uppercase font-medium">
          Newsletter
        </p>
        <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light">
          Únete a la comunidad
        </h2>
        <p className="text-foreground/70 max-w-xl mx-auto leading-relaxed">
          Recibe artículos sobre salud natural, fitoterapia y bienestar
          directamente en tu bandeja de entrada. Sin spam, solo contenido que
          aporta.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}

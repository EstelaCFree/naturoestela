import { ContactForm } from "@/features/contact/components/ContactForm";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contacto" className="py-24 lg:py-32 bg-warm-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Contacto
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light">
            ¿Hablamos?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: contact info + Sophia */}
          <div className="space-y-8">
            <p className="text-foreground/70 leading-relaxed">
              ¿Tienes dudas o quieres iniciar tu proceso de acompañamiento?
              Estoy aquí para escucharte.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Mail
                  className="text-lavender-elegant mt-0.5 shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-xs font-medium text-lavender-elegant uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:contacto@naturoestela.com"
                    className="text-foreground hover:text-lavender-elegant transition-colors"
                  >
                    contacto@naturoestela.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone
                  className="text-lavender-elegant mt-0.5 shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-xs font-medium text-lavender-elegant uppercase tracking-wider mb-1">
                    Teléfono
                  </p>
                  <a
                    href="tel:+34600000000"
                    className="text-foreground hover:text-lavender-elegant transition-colors"
                  >
                    +34 600 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin
                  className="text-lavender-elegant mt-0.5 shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-xs font-medium text-lavender-elegant uppercase tracking-wider mb-1">
                    Ubicación
                  </p>
                  <p className="text-foreground">Sesión presencial y online</p>
                </div>
              </div>
            </div>

            {/* Sophia assistant card */}
            <div className="bg-forest-green rounded-xl p-6 text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-medium">Asistente Virtual · Sophia</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                ¿No sabes qué servicio elegir? Sophia, nuestro asistente
                virtual, te ayudará a encontrar la mejor opción, resolverá tus
                dudas y te guiará para iniciar el proceso.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-forest-green text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
              >
                <MessageCircle size={16} />
                Iniciar chat con Sophia
              </button>
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

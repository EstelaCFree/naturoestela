const texts = [
  { text: "+500 personas han confiado en mí", offset: "0%" },
  { text: "+10 años de experiencia", offset: "29%" },
  { text: "Espacio seguro para neurodivergencias", offset: "50%" },
  { text: "Ciencia + tradición", offset: "82%" },
];

export function RotatingTrunk() {
  return (
    <section className="relative py-24 lg:py-32 bg-warm-ivory overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid lg:grid-cols-[25%_75%] gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-4 text-base md:text-lg leading-relaxed text-foreground/80">
              <p>
                Como en un árbol, tu vida y experiencias están escritas en ti.
                Tus síntomas y situación actuales son el resultado de ellas y
                hay que leer tu historia completa para entenderlas. Igual que a
                veces una foto estática sin contexto es difícil de interpretar,
                tú eres más que un montón de etiquetas, diagnósticos y letras en
                un informe.
              </p>
              <p>
                Juntas podemos dedicarle el tiempo y la atención que mereces
                para comprender qué te está pasando, cómo has llegado hasta aquí
                y escribir un futuro en equilibrio a través de acciones
                personalizadas y adaptadas a tu situación y esencia.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-3xl aspect-square">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-[70%] h-[35%] rounded-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1515446134809-993c501ca304?w=800&h=800&fit=crop&auto=format"
                    alt="Tronco de árbol natural"
                    className="w-full h-full object-cover animate-spin-slow"
                    style={{ animationDuration: "60s" }}
                  />
                </div>
              </div>

              <div
                className="absolute inset-0 animate-spin-slow"
                style={{ animationDuration: "60s" }}
              >
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 250, 250 m -210, 0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0"
                    />
                  </defs>
                  {texts.map((item, index) => (
                    <text
                      key={index}
                      className="text-[12px] fill-lavender-elegant font-medium tracking-wider uppercase"
                      style={{ letterSpacing: "0.12em" }}
                    >
                      <textPath href="#circlePath" startOffset={item.offset}>
                        {item.text}
                      </textPath>
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

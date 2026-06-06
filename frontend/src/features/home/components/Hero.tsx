export function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-screen min-h-[600px] flex items-center overflow-hidden"
    >
      {/* Background Image — left two thirds */}
      <div className="absolute inset-0 w-2/3 left-0">
        <img
          src="/assets/estela3.jpg"
          alt="Estela en un entorno natural de bienestar"
          className="w-full h-full object-cover"
          style={{ objectPosition: "left 30%" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Right panel — black */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-black">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-black" />
      </div>

      {/* Blend gradient between photo and black panel */}
      <div className="absolute inset-y-0 right-[33.33%] w-[11.11%] bg-gradient-to-r from-black/0 via-black/60 to-black pointer-events-none" />

      {/* Logo + tagline — right black panel */}
      <div className="absolute right-0 w-1/3 h-full flex flex-col items-center justify-center px-8 lg:px-12 z-10">
        <div className="mb-8 w-full">
          <img
            src="/assets/estela_castro_fondo_oscuro.svg"
            alt="Estela Castro Naturopatía"
            className="w-full h-auto"
          />
        </div>
        <p className="text-sm md:text-base text-white text-center leading-relaxed font-light px-2">
          Un espacio seguro donde la ciencia y la tradición se encuentran para
          acompañarte en tu camino hacia el equilibrio
        </p>
      </div>

      {/* Bouncing scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <span className="text-xs tracking-widest text-white/60 uppercase">
          Descubre
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

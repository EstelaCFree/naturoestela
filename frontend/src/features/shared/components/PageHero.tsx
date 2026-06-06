type PageHeroProps = {
  title: string;
  image: { webp: string; jpg: string };
};

export function PageHero({ title, image }: PageHeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
      {/* Photo — left two thirds */}
      <div className="absolute inset-0 w-2/3 left-0">
        <picture>
          <source srcSet={image.webp} type="image/webp" />
          <img
            src={image.jpg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </picture>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Right panel — black */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-black" />

      {/* Blend gradient between photo and black panel */}
      <div className="absolute inset-y-0 right-[33.33%] w-[11%] bg-gradient-to-r from-black/0 via-black/60 to-black pointer-events-none" />

      {/* Emblem watermark — behind title */}
      <div className="absolute inset-y-0 right-0 w-1/3 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/assets/estela_castro_emblema.svg"
          alt=""
          aria-hidden="true"
          className="w-[85%] h-auto opacity-30"
        />
      </div>

      {/* Title — above emblem */}
      <div className="absolute right-0 w-1/3 h-full flex items-center justify-center z-10">
        <h1 className="font-serif font-light text-white text-3xl tracking-[8px] uppercase text-center">
          {title}
        </h1>
      </div>
    </section>
  );
}

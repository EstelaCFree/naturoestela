import { cn } from "@/lib/cn";
import { LogoWatermark } from "./LogoWatermark";
import { products, statusColors, statusLabels } from "../data/coursesBooks";

const productImages: Record<string, string> = {
  "fundamentos-fitoterapia":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop&auto=format",
  "nutricion-integrativa":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&auto=format",
  "camino-equilibrio":
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&auto=format",
  "neurodivergencia-bienestar":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
};

export function CoursesBooks() {
  return (
    <section
      id="cursos-libros"
      className="py-24 lg:py-32 bg-light-cream relative overflow-hidden"
    >
      <LogoWatermark side="left" top="30%" rotation={-10} size={900} />
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Formación
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light">
            Cursos y Libros
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-light-cream rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={productImages[product.id]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-taupe uppercase tracking-wider">
                    {product.type === "course" ? "Curso" : "Libro"}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      statusColors[product.status],
                    )}
                  >
                    {statusLabels[product.status]}
                  </span>
                </div>
                <h3 className="font-medium text-foreground leading-snug text-sm">
                  {product.title}
                </h3>
                <p className="text-xs text-taupe leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/cursos-y-libros"
            className="inline-flex items-center justify-center px-8 py-3 bg-forest-green text-white text-sm font-medium tracking-wide rounded-sm hover:opacity-90 transition-opacity"
          >
            Ver todos
          </a>
        </div>
      </div>
    </section>
  );
}

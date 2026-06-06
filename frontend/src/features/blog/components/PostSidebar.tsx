import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Heart, Mail } from "lucide-react";
import {
  CATEGORY_CONFIG,
  FILTER_CATEGORIES,
} from "@/features/blog/data/categories";

export function PostSidebar() {
  return (
    <aside className="space-y-6">
      <CategoryList />
      <ContactCard />
      <AppointmentCard />
      <LikePlaceholder />
    </aside>
  );
}

function CategoryList() {
  return (
    <div className="bg-light-cream rounded-xl border border-taupe/10 p-5">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-taupe/60 mb-4">
        Explorar por categoría
      </h3>
      <ul className="space-y-2.5">
        {FILTER_CATEGORIES.map((slug) => {
          const config = CATEGORY_CONFIG[slug];
          return (
            <li key={slug}>
              <Link
                to={`/blog?category=${slug}`}
                className="flex items-center gap-3 text-sm text-foreground/75 hover:text-foreground transition-colors group"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: config.color }}
                />
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {config.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ContactCard() {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 bg-lavender-elegant" />
      <div className="bg-lavender-light/60 border border-lavender-elegant/20 border-t-0 rounded-b-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 p-2 bg-lavender-elegant/15 rounded-lg shrink-0">
            <Mail size={16} className="text-lavender-elegant" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground leading-snug">
              ¿Tienes dudas o comentarios?
            </p>
            <p className="text-xs text-taupe leading-relaxed">
              Escríbeme y te respondo con calma.
            </p>
          </div>
        </div>
        <a
          href="/#contacto"
          className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg border border-lavender-elegant text-lavender-elegant text-xs font-semibold tracking-wide hover:bg-lavender-elegant hover:text-white transition-all duration-200"
        >
          Escríbeme
        </a>
      </div>
    </div>
  );
}

function AppointmentCard() {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 bg-forest-green" />
      <div className="bg-forest-green/5 border border-forest-green/20 border-t-0 rounded-b-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 p-2 bg-forest-green/15 rounded-lg shrink-0">
            <Calendar size={16} className="text-forest-green" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground leading-snug">
              ¿Quieres una consulta personalizada?
            </p>
            <p className="text-xs text-taupe leading-relaxed">
              Hablamos de tu caso con calma y sin prisas.
            </p>
          </div>
        </div>
        <a
          href="/#contacto"
          className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-forest-green text-white text-xs font-semibold tracking-wide hover:opacity-90 transition-opacity"
        >
          Pedir cita
        </a>
      </div>
    </div>
  );
}

function LikePlaceholder() {
  const [liked, setLiked] = useState(false);

  {
    /* TODO (post-likes) — replace with real vote API call */
  }
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="h-1 bg-lavender-elegant/40" />
      <div className="bg-light-cream border border-taupe/10 border-t-0 rounded-b-xl p-5 text-center space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-taupe/70">
          ¿Te ha gustado?
        </p>
        <p className="text-xs text-taupe/80 leading-relaxed">
          Házmelo saber con tu voto.
        </p>
        <button
          type="button"
          onClick={() => setLiked(true)}
          disabled={liked}
          className="flex flex-col items-center gap-1 mx-auto group disabled:pointer-events-none"
          aria-label="Me gusta"
        >
          <Heart
            size={30}
            className={`transition-all duration-200 ${
              liked
                ? "fill-lavender-elegant stroke-lavender-elegant scale-110"
                : "stroke-lavender-elegant fill-transparent group-hover:fill-lavender-elegant/20 group-hover:scale-110"
            }`}
          />
          <span className="text-xs text-taupe tabular-nums">0</span>
        </button>
        {liked && (
          <p className="text-xs text-lavender-elegant font-semibold animate-pulse">
            ¡Gracias!
          </p>
        )}
      </div>
    </div>
  );
}

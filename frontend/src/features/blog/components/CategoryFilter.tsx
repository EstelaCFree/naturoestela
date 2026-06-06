import { Brain, Droplets, Leaf, Utensils, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  CATEGORY_CONFIG,
  FILTER_CATEGORIES,
} from "@/features/blog/data/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  aromaterapia: Droplets,
  "salud-natural": Leaf,
  neurodivergencia: Brain,
  "salud-digestiva": Waves,
  alimentacion: Utensils,
};

export function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  function handleSelect(slug: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (next.get("category") === slug) {
        next.delete("category");
      } else {
        next.set("category", slug);
        next.delete("page");
      }
      return next;
    });
    setTimeout(() => {
      document
        .getElementById("blog-archive")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
          {FILTER_CATEGORIES.map((slug) => {
            const isActive = activeCategory === slug;
            return (
              <CategoryCard
                key={slug}
                slug={slug}
                isActive={isActive}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type CategoryCardProps = {
  slug: string;
  isActive: boolean;
  onSelect: (slug: string) => void;
};

function CategoryCard({ slug, isActive, onSelect }: CategoryCardProps) {
  const config = CATEGORY_CONFIG[slug];
  const Icon = CATEGORY_ICONS[slug];

  return (
    <button
      type="button"
      onClick={() => onSelect(slug)}
      className="group flex flex-col items-center gap-2 focus:outline-none w-[100px]"
    >
      {/* Arch icon container — solid colour always */}
      <div
        className="w-[100px] h-[120px] flex items-center justify-center transition-all duration-300 group-hover:scale-105"
        style={{
          borderRadius: "50px 50px 8px 8px",
          backgroundColor: config.color,
          opacity: isActive ? 1 : 0.75,
        }}
      >
        <Icon size={36} color="#ffffff" />
      </div>

      {/* Label — fixed height so Explorar aligns across all cards */}
      <span
        className="text-xs font-medium tracking-wide text-center leading-tight w-full h-[32px] flex items-center justify-center"
        style={{ color: isActive ? config.color : "#8d7f75" }}
      >
        {config.label}
      </span>

      {/* Explorar — always at same vertical position */}
      <span
        className="text-[10px] font-semibold tracking-widest uppercase transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: config.color, opacity: isActive ? 1 : 0.55 }}
      >
        Explorar
      </span>
    </button>
  );
}

import { getCategoryConfig } from "@/features/blog/data/categories";
import type { Post } from "@/types/blog";

type BlogCardProps = {
  post: Post;
  cornerVariant?: "a" | "b";
};

const cornerClasses = {
  a: "rounded-tl-[32px] rounded-tr-[8px] rounded-bl-[8px] rounded-br-[32px]",
  b: "rounded-tl-[8px] rounded-tr-[32px] rounded-bl-[32px] rounded-br-[8px]",
};

export function BlogCard({ post, cornerVariant = "a" }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.published_at));

  const categoryConfig = getCategoryConfig(post.category.slug);

  return (
    <article
      className={`group bg-light-cream ${cornerClasses[cornerVariant]} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500`}
    >
      <a
        href={`/blog/${post.slug}`}
        className="block aspect-video overflow-hidden relative"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.featured_image?.thumbnail_url ? (
          <img
            src={post.featured_image.thumbnail_url}
            alt={post.featured_image.alt_text ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-lavender-light flex items-center justify-center">
            <img
              src="/assets/logo circular.png"
              alt=""
              aria-hidden="true"
              className="w-16 h-16 opacity-30"
            />
          </div>
        )}

        {/* Category badge */}
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-[10px] font-semibold tracking-widest uppercase"
          style={{ backgroundColor: categoryConfig?.color ?? "#a09ac2" }}
        >
          {post.category.name}
        </span>
      </a>

      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-taupe">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="3" width="12" height="11" rx="1.5" />
            <path d="M5 1v4M11 1v4M2 7h12" />
          </svg>
          <time dateTime={post.published_at}>{formattedDate}</time>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-foreground leading-snug line-clamp-2 text-[21.6px]">
            {post.title}
          </h3>
          <div
            className="h-px w-8"
            style={{ backgroundColor: categoryConfig?.color ?? "#a09ac2" }}
          />
        </div>

        <p className="text-sm text-taupe leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <a
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: categoryConfig?.color ?? "#a09ac2" }}
        >
          Leer más
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}

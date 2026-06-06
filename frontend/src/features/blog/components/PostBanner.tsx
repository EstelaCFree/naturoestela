import { getCategoryConfig } from "@/features/blog/data/categories";
import { readingTime } from "@/features/blog/utils/readingTime";
import type { Post } from "@/types/blog";

type PostBannerProps = { post: Post };

export function PostBanner({ post }: PostBannerProps) {
  const categoryConfig = getCategoryConfig(post.category.slug);
  const badgeColor = categoryConfig?.color ?? "#a09ac2";
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.published_at));

  return (
    <div className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      {post.featured_image?.original_url ? (
        <>
          <img
            src={post.featured_image?.original_url}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-warm-ivory" />
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <img
              src="/assets/estela_castro_emblema.svg"
              alt=""
              aria-hidden="true"
              className="w-1/2 h-auto"
            />
          </div>
        </>
      )}

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-10 pt-32">
        {/* Category badge */}
        <span
          className="inline-block px-3 py-1 rounded-full text-white text-[10px] font-semibold tracking-widest uppercase mb-4"
          style={{ backgroundColor: badgeColor }}
        >
          {post.category.name}
        </span>

        <h1
          className={`font-serif font-light leading-tight mb-4 ${
            post.featured_image?.original_url
              ? "text-white text-3xl lg:text-5xl"
              : "text-foreground text-3xl lg:text-5xl"
          }`}
        >
          {post.title}
        </h1>

        <div
          className={`flex items-center gap-4 text-sm ${
            post.featured_image?.original_url ? "text-white/70" : "text-taupe"
          }`}
        >
          <time dateTime={post.published_at}>{formattedDate}</time>
          <span>·</span>
          <span>{readingTime(post.content)}</span>
        </div>
      </div>
    </div>
  );
}

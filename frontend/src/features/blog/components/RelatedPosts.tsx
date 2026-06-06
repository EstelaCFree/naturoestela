import { usePosts } from "@/features/blog/hooks/usePosts";
import type { Post } from "@/types/blog";
import { BlogCard } from "./BlogCard";

type RelatedPostsProps = { post: Post };

const CORNER_VARIANTS = ["a", "b", "a"] as const;

export function RelatedPosts({ post }: RelatedPostsProps) {
  const { data: recentData } = usePosts({ pageSize: 4 });
  const { data: categoryData } = usePosts({
    category: post.category.slug,
    pageSize: 3,
  });

  const recentPosts = (recentData?.data ?? []).filter(
    (p) => p.slug !== post.slug,
  );
  const categoryPosts = (categoryData?.data ?? []).filter(
    (p) => p.slug !== post.slug,
  );

  const slugsSeen = new Set<string>();
  const related: Post[] = [];

  // 1 most recent (any category)
  for (const p of recentPosts) {
    if (related.length >= 1) break;
    if (!slugsSeen.has(p.slug)) {
      slugsSeen.add(p.slug);
      related.push(p);
    }
  }

  // up to 2 from same category
  for (const p of categoryPosts) {
    if (related.length >= 3) break;
    if (!slugsSeen.has(p.slug)) {
      slugsSeen.add(p.slug);
      related.push(p);
    }
  }

  if (related.length === 0) return null;

  return (
    <section className="py-16 border-t border-taupe/10">
      <div className="mb-10">
        <p className="text-xs tracking-widest text-lavender-elegant/70 uppercase font-medium mb-2">
          Sigue leyendo
        </p>
        <h2 className="font-serif text-3xl text-foreground font-light">
          Artículos relacionados
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((p, i) => (
          <BlogCard key={p.id} post={p} cornerVariant={CORNER_VARIANTS[i]} />
        ))}
      </div>
    </section>
  );
}

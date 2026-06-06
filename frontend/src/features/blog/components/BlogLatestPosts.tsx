import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { usePosts } from "@/features/blog/hooks/usePosts";
import { BlogCard } from "./BlogCard";

const CORNER_VARIANTS = ["a", "b", "a"] as const;

export function BlogLatestPosts() {
  const { data, isLoading, isError, error } = usePosts({ preview: true });
  const posts = data?.data ?? [];

  function scrollToArchive() {
    document
      .getElementById("blog-archive")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="py-24 lg:py-32 bg-warm-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Conocimiento &amp; Bienestar
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-foreground font-light">
            Últimas entradas
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-lavender-elegant/30" />
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-lavender-elegant" />
          </div>
        )}

        {isError && (
          <ErrorBanner
            message={error?.message ?? "No se pudieron cargar los artículos."}
          />
        )}

        {posts.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  cornerVariant={CORNER_VARIANTS[i % 3]}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={scrollToArchive}
                className="px-8 py-3.5 bg-forest-green text-white text-sm font-medium tracking-wide rounded-[6px] hover:opacity-90 transition-opacity"
              >
                Ver todos los artículos
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

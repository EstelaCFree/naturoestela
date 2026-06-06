import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { usePostsPreview } from "@/features/blog/hooks/usePosts";

export function BlogPreview() {
  const { data: posts, isLoading, isError, error } = usePostsPreview();

  return (
    <section id="blog" className="py-24 lg:py-32 bg-light-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            Blog
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light">
            Últimas entradas
          </h2>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-lavender-elegant" />
          </div>
        )}

        {isError && (
          <ErrorBanner
            message={
              error?.message ?? "No se pudieron cargar los artículos del blog."
            }
          />
        )}

        {posts && (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="flex justify-center">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-forest-green text-white text-sm font-medium tracking-wide rounded-sm hover:opacity-90 transition-opacity"
              >
                Ver todos los artículos
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

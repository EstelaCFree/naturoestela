import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { PostBanner } from "@/features/blog/components/PostBanner";
import { PostBody } from "@/features/blog/components/PostBody";
import { PostSidebar } from "@/features/blog/components/PostSidebar";
import { RelatedPosts } from "@/features/blog/components/RelatedPosts";
import { usePost } from "@/features/blog/hooks/usePost";
import { Footer } from "@/features/home/components/Footer";
import { Header } from "@/features/home/components/Header";
import { Newsletter } from "@/features/home/components/Newsletter";

export function PostDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePost(slug);

  return (
    <>
      <Header />
      <main>
        {isLoading && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Spinner className="h-10 w-10 text-lavender-elegant" />
          </div>
        )}

        {isError && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-serif text-3xl text-foreground font-light">
              Artículo no encontrado
            </p>
            <p className="text-taupe text-sm max-w-sm">
              Es posible que el artículo haya sido movido o no exista.
            </p>
            <Link
              to="/blog"
              className="text-sm font-medium text-lavender-elegant hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              ← Volver al blog
            </Link>
          </div>
        )}

        {post && (
          <>
            <PostBanner post={post} />

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              {/* Two-column layout: article + sidebar */}
              <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-12">
                <PostBody content={post.content} />

                <div className="lg:sticky lg:top-24 lg:self-start py-10">
                  <PostSidebar />
                </div>
              </div>

              {/* Related posts — full width below grid */}
              <RelatedPosts post={post} />
            </div>
          </>
        )}
      </main>

      {post && <Newsletter />}
      <Footer />
    </>
  );
}

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { usePosts } from "@/features/blog/hooks/usePosts";
import { BlogCard } from "./BlogCard";

const PAGE_SIZE = 12;

export function BlogArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");

  // Reset to page 1 when category changes
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isLoading, isError, error } = usePosts({
    page,
    pageSize: PAGE_SIZE,
    category,
  });
  const posts = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function goToPage(p: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (p === 1) {
        next.delete("page");
      } else {
        next.set("page", String(p));
      }
      return next;
    });
    document
      .getElementById("blog-archive")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="blog-archive" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            {category
              ? `Categoría: ${category.replace(/-/g, " ")}`
              : "Todos los artículos"}
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-foreground font-light">
            Archivo del blog
          </h2>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8 text-lavender-elegant" />
          </div>
        )}

        {isError && (
          <ErrorBanner
            message={error?.message ?? "No se pudieron cargar los artículos."}
          />
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <p className="text-center text-taupe py-12">
            No hay artículos publicados en esta categoría.
          </p>
        )}

        {posts.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  cornerVariant={i % 2 === 0 ? "a" : "b"}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Paginación del blog"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium text-taupe border border-taupe/30 rounded hover:border-lavender-elegant hover:text-lavender-elegant transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 text-sm font-medium rounded transition-colors ${
              p === page
                ? "bg-lavender-elegant text-white"
                : "text-taupe hover:text-lavender-elegant"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium text-taupe border border-taupe/30 rounded hover:border-lavender-elegant hover:text-lavender-elegant transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        Siguiente
      </button>
    </nav>
  );
}

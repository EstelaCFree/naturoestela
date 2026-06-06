import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "@/features/shared/components/PageHero";
import { CategoryFilter } from "@/features/blog/components/CategoryFilter";
import { BlogLatestPosts } from "@/features/blog/components/BlogLatestPosts";
import { BlogArchive } from "@/features/blog/components/BlogArchive";
import { Newsletter } from "@/features/home/components/Newsletter";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";

const blogImage = {
  webp: "/assets/blog-hero.webp",
  jpg: "/assets/blog-hero.jpg",
};

export function BlogPage() {
  const [searchParams] = useSearchParams();

  // When navigating here with a category filter (e.g. from the post sidebar),
  // scroll to the archive section after the page renders.
  useEffect(() => {
    if (searchParams.get("category")) {
      const timer = setTimeout(() => {
        document
          .getElementById("blog-archive")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <main>
        <PageHero title="Blog" image={blogImage} />
        <CategoryFilter />
        <BlogLatestPosts />
        <Newsletter />
        <BlogArchive />
      </main>
      <Footer />
    </>
  );
}

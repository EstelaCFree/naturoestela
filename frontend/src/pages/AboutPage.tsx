import { PageHero } from "@/features/shared/components/PageHero";
import { AboutIntro } from "@/features/about/components/AboutIntro";
import { AboutMore } from "@/features/about/components/AboutMore";
import { AboutStats } from "@/features/about/components/AboutStats";
import { AboutVideo } from "@/features/about/components/AboutVideo";
import { Footer } from "@/features/home/components/Footer";
import { Header } from "@/features/home/components/Header";
import { Testimonials } from "@/features/home/components/Testimonials";

const aboutImage = {
  webp: "/assets/about-hero.webp",
  jpg: "/assets/about-hero.jpg",
};

export function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero title="Sobre mí" image={aboutImage} />
        <AboutIntro />
        <AboutVideo />
        <AboutStats />
        <AboutMore />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

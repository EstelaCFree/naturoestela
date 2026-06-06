import { MessageCircle } from "lucide-react";
import { About } from "@/features/home/components/About";
import { BlogPreview } from "@/features/home/components/BlogPreview";
import { CoursesBooks } from "@/features/home/components/CoursesBooks";
import { Contact } from "@/features/home/components/Contact";
import { Faq } from "@/features/home/components/Faq";
import { Footer } from "@/features/home/components/Footer";
import { Header } from "@/features/home/components/Header";
import { Hero } from "@/features/home/components/Hero";
import { Newsletter } from "@/features/home/components/Newsletter";
import { RotatingTrunk } from "@/features/home/components/RotatingTrunk";
import { Services } from "@/features/home/components/Services";
import { Testimonials } from "@/features/home/components/Testimonials";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <RotatingTrunk />
        <About />
        <Services />
        <Testimonials />
        <CoursesBooks />
        <Faq />
        <BlogPreview />
        <Newsletter />
        <Contact />
      </main>
      <Footer />

      {/* Floating Sophia chat button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          type="button"
          className="flex items-center gap-3 bg-forest-green text-white px-7 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:pr-8"
          aria-label="Chatear con Sophia"
        >
          <MessageCircle size={24} className="shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500">
            ¿Tienes dudas? Prueba con Sophia
          </span>
        </button>
      </div>
    </>
  );
}

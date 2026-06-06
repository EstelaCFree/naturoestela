import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type NavItem =
  | { label: string; href: string; type: "anchor" }
  | { label: string; to: string; type: "route" };

const navItems: NavItem[] = [
  { label: "Inicio", to: "/", type: "route" },
  { label: "Sobre mí", to: "/sobre-mi", type: "route" },
  { label: "Servicios", href: "/#servicios", type: "anchor" },
  { label: "Testimonios", href: "/#testimonios", type: "anchor" },
  { label: "Cursos y Libros", href: "/#cursos-libros", type: "anchor" },
  { label: "Blog", to: "/blog", type: "route" },
  { label: "Contacto", href: "/#contacto", type: "anchor" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="relative z-10 flex items-center -ml-4 lg:-ml-6"
          >
            <img
              src={
                isScrolled
                  ? "/assets/estela_castro_horizontal_original.svg"
                  : "/assets/estela_castro_horizontal_fondo_oscuro.svg"
              }
              alt="Estela Castro Naturopatía"
              className="h-[70px] lg:h-[82px] w-auto transition-opacity duration-500"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const className = `text-sm tracking-wide transition-colors duration-300 relative group ${
                isScrolled
                  ? "text-foreground/80 hover:text-lavender-elegant"
                  : "text-white/90 hover:text-white drop-shadow-md"
              }`;
              const underline = (
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-lavender-elegant" : "bg-white"
                  }`}
                />
              );
              return (
                <li key={item.label}>
                  {item.type === "route" ? (
                    <Link to={item.to} className={className}>
                      {item.label}
                      {underline}
                    </Link>
                  ) : (
                    <a href={item.href} className={className}>
                      {item.label}
                      {underline}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden pb-6 border-t ${
              isScrolled ? "border-foreground/10" : "border-white/20"
            }`}
          >
            <ul className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => {
                const className = `block text-sm tracking-wide transition-colors ${
                  isScrolled ? "text-foreground/80" : "text-white/90"
                }`;
                return (
                  <li key={item.label}>
                    {item.type === "route" ? (
                      <Link
                        to={item.to}
                        className={className}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className={className}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

const resources = [
  { label: "Cursos y Libros", href: "/#cursos-libros" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas Frecuentes", href: "/#faq" },
  { label: "Newsletter", href: "/#newsletter" },
];

const legal = [
  { label: "Política de Privacidad", href: "#" },
  { label: "Términos y Condiciones", href: "#" },
  { label: "Aviso Legal", href: "#" },
];

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-green text-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <img
              src="/assets/estela_castro_fondo_oscuro.svg"
              alt="Estela Castro Naturopatía"
              className="h-48 w-auto"
            />
            <p className="text-sm text-white/60 leading-relaxed">
              Naturopatía integrativa para un bienestar real y sostenible.
              Ciencia · Naturaleza · Equilibrio
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-white/60">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Sobre mí", href: "/sobre-mi" },
                { label: "Servicios", href: "/#servicios" },
                { label: "Testimonios", href: "/#testimonios" },
                { label: "Contacto", href: "/#contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-white/60">
              Recursos
            </h4>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5 text-white/60">
              Legal
            </h4>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Estela Castro Naturopatía. Todos los
            derechos reservados.
          </p>
          <div className="flex gap-5">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-white/50 hover:text-white transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="text-white/50 hover:text-white transition-colors"
            >
              <LinkedInIcon />
            </a>
            <a
              href="mailto:contacto@naturoestela.com"
              aria-label="Email"
              className="text-white/50 hover:text-white transition-colors"
            >
              <MailIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

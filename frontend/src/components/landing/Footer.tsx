import Link from "next/link";
import { Flame } from "lucide-react";

const COLUMNS = [
  {
    title: "Producto",
    links: [
      { label: "Módulos", href: "#modulos" },
      { label: "Gamificación", href: "#gamificacion" },
      { label: "Cómo funciona", href: "#como-funciona" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentación", href: "https://github.com/sebadp/wasap-accademy", external: true },
      { label: "Changelog", href: "https://github.com/sebadp/wasap-accademy/releases", external: true },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { label: "GitHub", href: "https://github.com/sebadp/wasap-accademy", external: true },
      { label: "Reportar un bug", href: "https://github.com/sebadp/wasap-accademy/issues", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top: logo + columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo column */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                AgentCraft
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Aprendé IA Generativa construyendo un proyecto real de producción.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AgentCraft. Open source bajo MIT
            License.
          </p>
          <a
            href="https://github.com/sebadp/wasap-accademy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

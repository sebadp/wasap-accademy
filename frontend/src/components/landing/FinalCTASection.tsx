import Link from "next/link";
import { Zap } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

export default function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Listo para dominar{" "}
            <span className="text-primary">IA Generativa</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Empezá hoy. Aprendé construyendo un proyecto real, paso a paso, con
            código de producción.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Zap className="h-5 w-5" />
              Empezar ahora
            </Link>
            <Link
              href="https://github.com/sebadp/wasap-accademy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Ver documentación
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            100% Gratuito y Open Source
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

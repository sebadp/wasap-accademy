import { FileCode2, TestTube2, Layers } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";

const BENEFITS = [
  {
    icon: FileCode2,
    stat: "85",
    label: "archivos",
    description:
      "Un proyecto Python real con skills, servicios, middleware, tests y configuración profesional.",
  },
  {
    icon: TestTube2,
    stat: "316",
    label: "tests",
    description:
      "Cada módulo tiene tests que validan tu comprensión. Si los tests pasan, entendiste el concepto.",
  },
  {
    icon: Layers,
    stat: "100%",
    label: "arquitectura real",
    description:
      "Clean architecture, dependency injection, error handling y patterns que usarías en un equipo profesional.",
  },
];

const CONCEPTS = [
  "LLM",
  "Memoria",
  "RAG",
  "Tool calling",
  "Agentes",
  "Guardrails",
  "Tracing",
  "Arquitectura limpia",
];

export default function SolutionSection() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <SectionHeading
            badge="La solución"
            title="Aprendé construyendo WasAP de verdad"
            highlight="WasAP"
            subtitle="Un asistente de WhatsApp con IA completo. Vos lo construís paso a paso, módulo a módulo."
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <AnimateOnScroll key={benefit.label} delay={i * 100}>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {benefit.stat}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {benefit.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Concept tags */}
        <AnimateOnScroll delay={400}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {CONCEPTS.map((concept) => (
              <span
                key={concept}
                className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              >
                {concept}
              </span>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

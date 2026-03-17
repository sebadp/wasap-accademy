import { BookOpen, Code2, FlaskConical } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    number: 1,
    icon: BookOpen,
    title: "Lecciones interactivas",
    description:
      "Cada módulo tiene lecciones en MDX con explicaciones claras, diagramas y ejemplos de código real del proyecto.",
    mockup: (
      <div className="rounded-lg border border-border bg-card p-4 text-xs">
        <div className="mb-2 h-2 w-24 rounded bg-primary/30" />
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded bg-muted" />
          <div className="h-2 w-5/6 rounded bg-muted" />
          <div className="h-2 w-4/6 rounded bg-muted" />
        </div>
        <div className="mt-3 rounded border border-border bg-zinc-900 p-2">
          <div className="space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-emerald-500/30" />
            <div className="h-1.5 w-1/2 rounded bg-blue-500/30" />
            <div className="h-1.5 w-5/6 rounded bg-emerald-500/30" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Code2,
    title: "Editor en browser",
    description:
      "Escribí Python directamente en el navegador con Monaco Editor. Sin instalar nada, sin configurar entornos.",
    mockup: (
      <div className="rounded-lg border border-border bg-card text-xs">
        <div className="flex border-b border-border">
          <div className="flex-1 border-r border-border p-3">
            <div className="mb-2 text-[10px] text-muted-foreground">
              editor.py
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded bg-blue-500/30" />
              <div className="h-1.5 w-3/4 rounded bg-emerald-500/30" />
              <div className="h-1.5 w-5/6 rounded bg-blue-500/30" />
              <div className="h-1.5 w-1/2 rounded bg-accent/30" />
            </div>
          </div>
          <div className="flex-1 p-3">
            <div className="mb-2 text-[10px] text-muted-foreground">
              output
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-4/5 rounded bg-success/30" />
              <div className="h-1.5 w-3/5 rounded bg-success/30" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    icon: FlaskConical,
    title: "Desafíos prácticos",
    description:
      "Resolvé challenges con tests automatizados que validan tu código. Si los tests pasan, dominás el concepto.",
    mockup: (
      <div className="rounded-lg border border-border bg-card p-4 text-xs">
        <div className="mb-2 text-[10px] font-medium text-foreground">
          Test results
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">test_agent_init</span>
            <span className="ml-auto text-success">passed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">test_tool_calling</span>
            <span className="ml-auto text-success">passed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">test_memory_store</span>
            <span className="ml-auto text-success">passed</span>
          </div>
        </div>
        <div className="mt-3 rounded bg-success/10 px-2 py-1 text-center text-success">
          3/3 tests passing ✓
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <SectionHeading
            badge="Cómo funciona"
            title="Aprendé haciendo, no solo leyendo"
            subtitle="Tres formas de aprendizaje integradas en cada módulo."
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 150}>
              <div className="flex flex-col">
                {/* Step number + icon */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                    {step.number}
                  </div>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {/* Visual mockup */}
                <div className="mt-4">{step.mockup}</div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

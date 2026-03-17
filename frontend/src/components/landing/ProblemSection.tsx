import { BookX, Puzzle, FolderSearch } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";

const PROBLEMS = [
  {
    icon: BookX,
    title: "Ejemplos de juguete",
    description:
      "Los tutoriales te enseñan a hacer un chatbot en 10 líneas. Pero en producción necesitás manejar errores, estado, herramientas y memoria.",
  },
  {
    icon: Puzzle,
    title: "Sin contexto real",
    description:
      "Aprendés conceptos aislados sin ver cómo encajan en una arquitectura de verdad. RAG, agentes y tool calling quedan como buzzwords.",
  },
  {
    icon: FolderSearch,
    title: "No hay código para estudiar",
    description:
      "Buscás proyectos reales de IA para aprender, pero encontrás demos desactualizadas sin tests ni documentación.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <SectionHeading
            badge="El problema"
            title="Los cursos te enseñan ejemplos, no realidad"
            subtitle="La brecha entre un tutorial de IA y producción es enorme. Y nadie te enseña a cruzarla."
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <AnimateOnScroll key={problem.title} delay={i * 100}>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <problem.icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={400}>
          <blockquote className="mx-auto mt-12 max-w-2xl border-l-4 border-accent pl-6 text-muted-foreground italic">
            &ldquo;Hice 5 cursos de LLM y todavía no puedo armar un agente que
            funcione en producción.&rdquo;
          </blockquote>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

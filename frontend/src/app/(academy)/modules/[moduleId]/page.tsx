import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonList, getModuleList } from "@/lib/content/loader";
import { Clock, Zap, Circle } from "lucide-react";

interface Props {
  params: Promise<{ moduleId: string }>;
}

export async function generateStaticParams() {
  const modules = getModuleList();
  return modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params;
  const lessons = getLessonList(moduleId);
  const modules = getModuleList();
  const mod = modules.find((m) => m.id === moduleId);

  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/modules" className="hover:text-foreground">Modulos</Link>
        {" / "}
        <span>{mod.title}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">{mod.title}</h1>
      <p className="text-muted-foreground mb-8">{mod.description}</p>

      {lessons.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Contenido proximamente
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.lessonId}
              href={`/modules/${moduleId}/${lesson.lessonId}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm text-muted-foreground font-mono">
                {i === 0 ? <Circle className="h-4 w-4 text-accent" /> : <Circle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{lesson.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.readingTimeMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-xp-gold" />
                  {lesson.xpReward} XP
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

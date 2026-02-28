import Link from "next/link";
import { CheckCircle, Circle, Lock } from "lucide-react";
import type { LessonMeta } from "@/lib/content/types";

interface Props {
  moduleId: string;
  lessons: LessonMeta[];
  currentLessonId: string;
  completedLessons?: Set<string>;
}

export function LessonSidebar({ moduleId, lessons, currentLessonId, completedLessons = new Set() }: Props) {
  return (
    <nav className="w-56 flex-shrink-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Lecciones
      </p>
      <div className="space-y-1">
        {lessons.map((lesson, i) => {
          const isActive = lesson.lessonId === currentLessonId;
          const isCompleted = completedLessons.has(lesson.lessonId);
          const isLocked = i > 0 && !completedLessons.has(lessons[i - 1].lessonId) && !isCompleted;

          return (
            <Link
              key={lesson.lessonId}
              href={isLocked ? "#" : `/modules/${moduleId}/${lesson.lessonId}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : isLocked
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-success" />
              ) : isLocked ? (
                <Lock className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="line-clamp-2">{lesson.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

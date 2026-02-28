import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LessonMeta } from "@/lib/content/types";

interface Props {
  moduleId: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNav({ moduleId, prev, next }: Props) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/modules/${moduleId}/${prev.lessonId}`}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link
          href={`/modules/${moduleId}/${next.lessonId}`}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {next.title}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

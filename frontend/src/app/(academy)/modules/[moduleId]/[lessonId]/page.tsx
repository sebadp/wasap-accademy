import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import { getLessonContent, getLessonList, getModuleList } from "@/lib/content/loader";
import { getMDXComponents } from "@/components/mdx/MDXComponents";
import { LessonSidebar } from "@/components/navigation/LessonSidebar";
import { LessonNav } from "@/components/navigation/LessonNav";
import { CompleteButton } from "@/components/lesson/CompleteButton";
import { Clock, Zap } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MDX_OPTIONS: any = {
  mdxOptions: {
    rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
  },
};

interface Props {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  const modules = getModuleList();
  const params: { moduleId: string; lessonId: string }[] = [];
  for (const mod of modules) {
    const lessons = getLessonList(mod.id);
    for (const lesson of lessons) {
      params.push({ moduleId: mod.id, lessonId: lesson.lessonId });
    }
  }
  return params;
}

export default async function LessonPage({ params }: Props) {
  const { moduleId, lessonId } = await params;
  const lessonContent = await getLessonContent(moduleId, lessonId);
  if (!lessonContent) notFound();

  const { meta, source } = lessonContent;
  const lessons = getLessonList(moduleId);
  const currentIndex = lessons.findIndex((l) => l.lessonId === lessonId);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const modules = getModuleList();
  const mod = modules.find((m) => m.id === moduleId);

  return (
    <div className="flex gap-8 mx-auto max-w-5xl">
      {/* Sidebar */}
      <aside className="hidden lg:block sticky top-20 self-start">
        <LessonSidebar
          moduleId={moduleId}
          lessons={lessons}
          currentLessonId={lessonId}
        />
      </aside>

      {/* Content */}
      <article className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-muted-foreground">
          <Link href="/modules" className="hover:text-foreground">Modulos</Link>
          {" / "}
          <Link href={`/modules/${moduleId}`} className="hover:text-foreground">{mod?.title}</Link>
          {" / "}
          <span>{meta.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{meta.title}</h1>
          {meta.description && (
            <p className="mt-2 text-muted-foreground">{meta.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meta.readingTimeMinutes} min de lectura
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-xp-gold" />
              {meta.xpReward} XP
            </span>
          </div>
        </div>

        {/* MDX Body */}
        <div className="prose-invert">
          <MDXRemote source={source} components={getMDXComponents()} options={MDX_OPTIONS} />
        </div>

        {/* Complete Button */}
        <div className="mt-10">
          <CompleteButton moduleId={moduleId} lessonId={lessonId} xpReward={meta.xpReward} />
        </div>

        {/* Prev / Next */}
        <LessonNav moduleId={moduleId} prev={prev} next={next} />
      </article>
    </div>
  );
}

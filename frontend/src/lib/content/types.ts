export interface LessonMeta {
  moduleId: string;
  lessonId: string;
  slug: string;       // e.g. "00-bienvenida"
  title: string;
  description: string;
  order: number;
  xpReward: number;
  readingTimeMinutes: number;
}

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  tier: "Foundation" | "Core" | "Advanced" | "Specialist" | "Capstone";
  order: number;
  lessons: LessonMeta[];
  totalXP: number;
}

export interface LessonContent {
  meta: LessonMeta;
  source: string;  // compiled MDX source for next-mdx-remote
}

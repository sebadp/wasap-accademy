import { getModuleList } from "@/lib/content/loader";
import { SkillTreeClient } from "@/components/gamification/SkillTreeClient";

export default function SkillTreePage() {
  const modules = getModuleList();

  return <SkillTreeClient modules={modules} />;
}

import { codeToHtml } from "shiki";

export async function CodeBlock({
  code,
  lang = "python",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    theme: "github-dark",
  });

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border text-sm">
      {title && (
        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 font-mono border-b border-border">
          {title}
        </div>
      )}
      <div
        className="[&>pre]:p-4 [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

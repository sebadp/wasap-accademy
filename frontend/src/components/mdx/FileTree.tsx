import { Folder, FileText } from "lucide-react";

/**
 * Renders a file tree from a formatted string prop.
 * Each line is a path entry. Indent with 2 spaces per level.
 * Append [h] to highlight a line. Dirs end with /.
 *
 * Usage in MDX:
 * <FileTree paths="wasap/
 *   app/ [h]
 *     webhook/
 *       handler.py" />
 */
interface ParsedLine {
  name: string;
  depth: number;
  isDir: boolean;
  highlight: boolean;
}

function parseLines(raw: string): ParsedLine[] {
  return raw
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const depth = Math.floor((line.length - line.trimStart().length) / 2);
      const trimmed = line.trim();
      const highlight = trimmed.endsWith("[h]");
      const name = highlight ? trimmed.slice(0, -3).trim() : trimmed;
      const isDir = name.endsWith("/");
      return { name, depth, isDir, highlight };
    });
}

export function FileTree({ paths }: { paths: string }) {
  const lines = parseLines(paths ?? "");

  return (
    <div className="my-6 rounded-lg border border-border bg-card p-4 font-mono text-sm">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`flex items-center gap-1.5 py-0.5 ${
            line.highlight ? "text-accent font-semibold" : "text-muted-foreground"
          }`}
          style={{ paddingLeft: `${line.depth * 16 + 4}px` }}
        >
          {line.isDir ? (
            <Folder className="h-3.5 w-3.5 flex-shrink-0 text-xp-gold" />
          ) : (
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
          )}
          {line.name}
        </div>
      ))}
    </div>
  );
}

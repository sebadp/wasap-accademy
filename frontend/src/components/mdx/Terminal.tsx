import { Terminal as TerminalIcon } from "lucide-react";

export function Terminal({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 text-xs text-zinc-400">
        <TerminalIcon className="h-3.5 w-3.5" />
        <span>{title ?? "terminal"}</span>
      </div>
      <pre className="bg-zinc-950 p-4 text-sm text-emerald-400 overflow-x-auto font-mono leading-relaxed m-0">
        {children}
      </pre>
    </div>
  );
}

export function Concept({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-border bg-secondary p-4">
      <span className="inline-block rounded bg-primary/20 px-2 py-0.5 text-xs font-mono font-semibold text-primary mb-2">
        {term}
      </span>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

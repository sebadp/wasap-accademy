export function Step({ number, title, children }: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 flex gap-4">
      <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <div className="text-muted-foreground text-sm [&>p]:mt-2">{children}</div>
      </div>
    </div>
  );
}

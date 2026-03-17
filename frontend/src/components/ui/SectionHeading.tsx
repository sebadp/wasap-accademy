interface Props {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  subtitle,
  align = "center",
}: Props) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  const renderedTitle = highlight
    ? title.split(highlight).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && (
            <span className="text-primary">{highlight}</span>
          )}
        </span>
      ))
    : title;

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {badge && (
        <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {renderedTitle}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

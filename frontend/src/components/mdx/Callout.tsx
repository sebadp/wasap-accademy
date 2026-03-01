import { Info, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

type Variant = "info" | "warning" | "error" | "tip";

const VARIANTS: Record<Variant, { icon: typeof Info; classes: string; label: string }> = {
  info:    { icon: Info,          classes: "border-blue-500/30 bg-blue-500/10 text-blue-300",   label: "Info" },
  warning: { icon: AlertTriangle, classes: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300", label: "Atención" },
  error:   { icon: XCircle,       classes: "border-red-500/30 bg-red-500/10 text-red-300",     label: "Error" },
  tip:     { icon: Lightbulb,     classes: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", label: "Tip" },
};

export function Callout({ variant = "info", title, children }: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, classes, label } = VARIANTS[variant];
  return (
    <div className={`my-6 rounded-lg border p-4 ${classes}`}>
      <div className="flex items-center gap-2 font-semibold text-sm mb-2">
        <Icon className="h-4 w-4" />
        {title ?? label}
      </div>
      <div className="text-sm opacity-90 [&>p]:m-0">{children}</div>
    </div>
  );
}

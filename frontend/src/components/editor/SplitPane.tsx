interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitPane({ left, right }: Props) {
  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-border">
      <div className="flex w-1/2 flex-col overflow-hidden border-r border-border">
        {left}
      </div>
      <div className="flex w-1/2 flex-col overflow-hidden">
        {right}
      </div>
    </div>
  );
}

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitPane({ left, right }: Props) {
  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border border-border md:flex-row">
      <div className="flex w-full min-h-[50vh] flex-col overflow-hidden border-b border-border md:min-h-0 md:w-1/2 md:border-b-0 md:border-r">
        {left}
      </div>
      <div className="flex w-full min-h-[40vh] flex-col overflow-hidden md:min-h-0 md:w-1/2">
        {right}
      </div>
    </div>
  );
}

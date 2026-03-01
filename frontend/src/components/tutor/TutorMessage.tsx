interface Props {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function TutorMessage({ role, content, timestamp }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser ? "bg-primary/30 text-primary" : "bg-zinc-700 text-foreground"
        }`}
      >
        {isUser ? "T" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? "bg-primary/20 text-foreground"
            : "bg-zinc-800 text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className="mt-1 text-[10px] text-muted-foreground">{timestamp}</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { TutorMessage } from "./TutorMessage";
import { askTutor } from "@/lib/api/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Props {
  challengeId: string;
  moduleId: string;
}

const FREE_QUESTIONS_TOTAL = 3;
const XP_COST_PER_QUESTION = 25;

export function TutorPanel({ challengeId, moduleId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [freeRemaining, setFreeRemaining] = useState<number>(FREE_QUESTIONS_TOTAL);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    const timestamp = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { role: "user", content: question, timestamp }]);
    setLoading(true);

    try {
      const res = await askTutor({ challenge_id: challengeId, question, module_id: moduleId });
      setFreeRemaining(res.free_questions_remaining);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, timestamp },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Error al consultar al tutor.",
          timestamp,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const willCostXP = freeRemaining === 0;

  return (
    <div className="flex h-full flex-col border-t border-border bg-zinc-950">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
        <span className="text-xs font-semibold text-foreground">Tutor IA</span>
        <span className="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
          {freeRemaining > 0
            ? `${freeRemaining} preguntas gratis`
            : `${XP_COST_PER_QUESTION} XP/pregunta`}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Tenés {FREE_QUESTIONS_TOTAL} preguntas gratis. ¡Preguntale al tutor!
          </p>
        )}
        {messages.map((m, i) => (
          <TutorMessage key={i} role={m.role} content={m.content} timestamp={m.timestamp} />
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">
              AI
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* XP warning */}
      {willCostXP && (
        <div className="shrink-0 border-t border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 text-[10px] text-yellow-400">
          Esta pregunta cuesta {XP_COST_PER_QUESTION} XP
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 flex gap-2 border-t border-border p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Preguntá sobre el challenge... (Enter para enviar)"
          rows={2}
          className="flex-1 resize-none rounded-lg bg-zinc-800 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="self-end rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:opacity-90"
        >
          →
        </button>
      </div>
    </div>
  );
}

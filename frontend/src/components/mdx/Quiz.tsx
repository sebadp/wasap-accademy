"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  question: string;
  options: string[];
  correct: number;
}

export function Quiz({ question, options = [], correct }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = answered && selected === correct;

  return (
    <div className="my-6 rounded-xl border border-border bg-card p-6">
      <p className="font-semibold text-foreground mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((label, i) => {
          let classes =
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ";
          if (!answered) {
            classes += "border-border cursor-pointer hover:border-primary/50 hover:bg-secondary";
          } else if (i === selected) {
            classes += isCorrect
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
              : "border-red-500 bg-red-500/10 text-red-300";
          } else if (i === correct) {
            classes += "border-emerald-500/50 bg-emerald-500/5 text-emerald-400/70";
          } else {
            classes += "border-border opacity-50";
          }

          return (
            <button
              key={i}
              className={classes}
              disabled={answered}
              onClick={() => setSelected(i)}
            >
              <span className="flex-1 text-left">{label}</span>
              {answered && i === selected &&
                (isCorrect ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                ))}
              {answered && i === correct && i !== selected && (
                <CheckCircle className="h-4 w-4 text-emerald-400/70" />
              )}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          className={`mt-4 text-sm font-medium ${
            isCorrect ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isCorrect
            ? "Correcto!"
            : "Incorrecto. La respuesta correcta está marcada arriba."}
        </p>
      )}
    </div>
  );
}

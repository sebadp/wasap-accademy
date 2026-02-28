"use client";

import { useState } from "react";
import { TestResults } from "./TestResults";
import type { RunResult } from "@/lib/pyodide/types";

type Tab = "output" | "tests";

interface Props {
  result: RunResult | null;
  loading: boolean;
}

export function OutputPanel({ result, loading }: Props) {
  const [tab, setTab] = useState<Tab>("output");

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "output", label: "Salida" },
    { id: "tests", label: "Tests", badge: result ? result.testsPassed : undefined },
  ];

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-sm">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors ${
              tab === t.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.badge !== undefined && result && (
              <span className={`rounded px-1.5 py-0.5 text-xs ${result.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {result.testsPassed}/{result.testsTotal}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            Ejecutando Python...
          </div>
        )}

        {!loading && !result && (
          <p className="text-muted-foreground">
            Hacé click en <span className="font-semibold text-foreground">Ejecutar</span> para correr tu código.
          </p>
        )}

        {!loading && result && tab === "output" && (
          <div className="space-y-4">
            {result.stdout && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">stdout</p>
                <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap">{result.stdout}</pre>
              </div>
            )}
            {result.stderr && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">stderr / error</p>
                <pre className="font-mono text-xs text-red-400 whitespace-pre-wrap">{result.stderr}</pre>
              </div>
            )}
            {!result.stdout && !result.stderr && (
              <p className="text-muted-foreground text-xs">Sin salida.</p>
            )}
          </div>
        )}

        {!loading && result && tab === "tests" && (
          <TestResults
            results={result.testResults}
            testsPassed={result.testsPassed}
            testsTotal={result.testsTotal}
          />
        )}
      </div>
    </div>
  );
}

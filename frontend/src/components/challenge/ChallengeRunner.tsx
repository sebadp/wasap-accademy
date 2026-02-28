"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { SplitPane } from "@/components/editor/SplitPane";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { pyodideClient } from "@/lib/pyodide/worker-client";
import { getChallenge, submitChallenge } from "@/lib/api/client";
import type { ChallengeDefinition, ChallengeSubmitResponse } from "@/types";
import type { RunResult, WorkerStatus } from "@/lib/pyodide/types";

interface Props {
  challengeId: string;
}

export function ChallengeRunner({ challengeId }: Props) {
  const [challenge, setChallenge] = useState<ChallengeDefinition | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>("loading");
  const [submitResult, setSubmitResult] = useState<ChallengeSubmitResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getChallenge(challengeId)
      .then((c) => {
        setChallenge(c);
        setCode(c.starter_code);
      })
      .catch(console.error);
  }, [challengeId]);

  useEffect(() => {
    pyodideClient.init();
    setWorkerStatus(pyodideClient.getStatus());
    return pyodideClient.onStatusChange(setWorkerStatus);
  }, []);

  const handleRun = async () => {
    if (!challenge || workerStatus !== "ready") return;
    setRunning(true);
    setSubmitResult(null);
    setSubmitError(null);
    try {
      const r = await pyodideClient.runCode(code, challenge.test_code);
      setResult(r);
    } catch (err) {
      setResult({
        stdout: "",
        stderr: err instanceof Error ? err.message : "Error desconocido",
        testResults: [],
        testsPassed: 0,
        testsTotal: 0,
        passed: false,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge || !result || !result.passed) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const r = await submitChallenge({
        challenge_id: challenge.challenge_id,
        code,
        tests_passed: result.testsPassed,
        tests_total: result.testsTotal,
        passed: result.passed,
      });
      setSubmitResult(r);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Cargando challenge...
      </div>
    );
  }

  const canRun = workerStatus === "ready" && !running;
  const canSubmit = !!result?.passed && !submitting && !submitResult;

  const leftPane = (
    <div className="flex h-full flex-col">
      {/* Challenge description */}
      <div className="overflow-y-auto border-b border-border bg-zinc-950/40 p-4" style={{ maxHeight: "40%" }}>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{challenge.title}</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">{challenge.description}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-yellow-400">
          <span>⚡</span>
          <span>{challenge.xp_reward} XP al completar</span>
        </div>
      </div>
      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor value={code} onChange={setCode} />
      </div>
    </div>
  );

  const rightPane = (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <OutputPanel result={result} loading={running} />
      </div>
      <div className="h-64 shrink-0">
        <TutorPanel challengeId={challengeId} moduleId={challenge.module_id} />
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Status bar */}
      {workerStatus === "loading" && (
        <div className="flex items-center gap-2 border-b border-border bg-zinc-900 px-4 py-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
          Inicializando Python (Pyodide)...
        </div>
      )}

      {/* Action bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-zinc-900 px-4 py-2">
        <span className="flex-1 text-sm font-semibold text-foreground">{challenge.title}</span>
        <button
          onClick={handleRun}
          disabled={!canRun}
          className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {running ? "Ejecutando..." : "▶ Ejecutar"}
        </button>
        {result?.passed && !submitResult && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? "Enviando..." : "✓ Enviar solución"}
          </button>
        )}
      </div>

      {/* Submit success */}
      {submitResult && (
        <div className="flex shrink-0 items-center gap-3 border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm">
          <span className="text-emerald-400">¡Challenge completado!</span>
          {submitResult.xp_awarded > 0 && (
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              +{submitResult.xp_awarded} XP
            </span>
          )}
          {submitResult.badge_unlocked && (
            <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
              🏆 {submitResult.badge_unlocked}
            </span>
          )}
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
          {submitError}
        </div>
      )}

      {/* Editor + Output */}
      <div className="flex-1 overflow-hidden p-4">
        <SplitPane left={leftPane} right={rightPane} />
      </div>
    </div>
  );
}

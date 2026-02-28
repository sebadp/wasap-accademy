import { CheckCircle, XCircle } from "lucide-react";
import type { TestResult } from "@/lib/pyodide/types";

interface Props {
  results: TestResult[];
  testsPassed: number;
  testsTotal: number;
}

export function TestResults({ results, testsPassed, testsTotal }: Props) {
  if (results.length === 0) return null;

  const allPassed = testsPassed === testsTotal;

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 text-sm font-semibold ${allPassed ? "text-emerald-400" : "text-red-400"}`}>
        {allPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {testsPassed}/{testsTotal} tests pasaron
      </div>
      <div className="space-y-1">
        {results.map((r) => (
          <div key={r.name} className={`rounded-lg border p-3 text-sm ${r.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <div className="flex items-center gap-2">
              {r.passed
                ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                : <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />}
              <span className={`font-mono ${r.passed ? "text-emerald-300" : "text-red-300"}`}>{r.name}</span>
            </div>
            {r.error && (
              <pre className="mt-2 text-xs text-red-400/80 whitespace-pre-wrap font-mono pl-5">
                {r.error}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

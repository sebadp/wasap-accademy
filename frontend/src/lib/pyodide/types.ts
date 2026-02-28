export interface TestResult {
  name: string;
  passed: boolean;
  error: string | null;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  testsPassed: number;
  testsTotal: number;
  passed: boolean;
  testResults: TestResult[];
}

export type WorkerStatus = "loading" | "ready" | "running" | "error";

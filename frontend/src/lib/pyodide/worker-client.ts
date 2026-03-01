import type { RunResult, WorkerStatus } from "./types";

type StatusListener = (status: WorkerStatus) => void;

class PyodideWorkerClient {
  private worker: Worker | null = null;
  private status: WorkerStatus = "loading";
  private listeners: StatusListener[] = [];
  private pendingRequests = new Map<
    string,
    { resolve: (r: RunResult) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }
  >();

  init() {
    if (typeof window === "undefined") return; // SSR guard
    if (this.worker) return;

    this.worker = new Worker("/pyodide-worker.js");
    this.worker.onmessage = (event) => this.handleMessage(event.data);
    this.worker.onerror = (err) => {
      this.setStatus("error");
      console.error("Pyodide worker error:", err);
    };
  }

  private handleMessage(data: Record<string, unknown>) {
    if (data.type === "ready") {
      this.setStatus("ready");
      return;
    }

    if (data.type === "result" || data.type === "error") {
      const requestId = data.requestId as string;
      const pending = this.pendingRequests.get(requestId);
      if (!pending) return;

      clearTimeout(pending.timer);
      this.pendingRequests.delete(requestId);
      this.setStatus("ready");

      if (data.type === "error") {
        pending.reject(new Error(data.message as string));
      } else {
        pending.resolve(data as unknown as RunResult);
      }
    }
  }

  private setStatus(status: WorkerStatus) {
    this.status = status;
    this.listeners.forEach((l) => l(status));
  }

  getStatus(): WorkerStatus {
    return this.status;
  }

  onStatusChange(listener: StatusListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  runCode(code: string, testCode: string, timeoutMs = 30_000): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      if (!this.worker || this.status === "error") {
        reject(new Error("Worker not available"));
        return;
      }

      const requestId = crypto.randomUUID();
      this.setStatus("running");

      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.setStatus("ready");
        reject(new Error("Execution timed out (30s)"));
      }, timeoutMs);

      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ type: "run", code, testCode, requestId });
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.status = "loading";
  }
}

// Singleton — one worker per browser session
export const pyodideClient = new PyodideWorkerClient();

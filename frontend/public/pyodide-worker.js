/**
 * Pyodide Web Worker
 * Loads Python WASM from CDN and executes student code + tests.
 * Runs in an isolated thread — never blocks the UI.
 */

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js";

let pyodide = null;
let ready = false;

async function loadPyodide() {
  importScripts(PYODIDE_CDN);
  pyodide = await loadPyodide({
    stdout: () => {},
    stderr: () => {},
  });
  ready = true;
  self.postMessage({ type: "ready" });
}

/**
 * Run student code + test code. Returns stdout, stderr, and test results.
 */
async function runCode(code, testCode, requestId) {
  const stdout = [];
  const stderr = [];

  pyodide.setStdout({ batched: (line) => stdout.push(line) });
  pyodide.setStderr({ batched: (line) => stderr.push(line) });

  try {
    // Execute student code
    await pyodide.runPythonAsync(code);
  } catch (err) {
    self.postMessage({
      type: "result",
      requestId,
      stdout: stdout.join("\n"),
      stderr: String(err),
      testsPassed: 0,
      testsTotal: 0,
      passed: false,
      testResults: [],
    });
    return;
  }

  // Run tests
  const testResults = [];
  let testsPassed = 0;

  // Extract test functions from testCode
  const testFnRegex = /^def (test_\w+)\(\):/gm;
  const testFunctions = [...testCode.matchAll(testFnRegex)].map((m) => m[1]);

  // Inject test code into namespace
  try {
    await pyodide.runPythonAsync(testCode);
  } catch (err) {
    self.postMessage({
      type: "result",
      requestId,
      stdout: stdout.join("\n"),
      stderr: `Error in test code: ${String(err)}`,
      testsPassed: 0,
      testsTotal: testFunctions.length,
      passed: false,
      testResults: testFunctions.map((name) => ({ name, passed: false, error: "Test code error" })),
    });
    return;
  }

  // Run each test function individually
  for (const fnName of testFunctions) {
    try {
      await pyodide.runPythonAsync(`${fnName}()`);
      testResults.push({ name: fnName, passed: true, error: null });
      testsPassed++;
    } catch (err) {
      testResults.push({ name: fnName, passed: false, error: String(err) });
    }
  }

  self.postMessage({
    type: "result",
    requestId,
    stdout: stdout.join("\n"),
    stderr: stderr.join("\n"),
    testsPassed,
    testsTotal: testFunctions.length,
    passed: testsPassed === testFunctions.length && testFunctions.length > 0,
    testResults,
  });
}

self.onmessage = async (event) => {
  const { type, code, testCode, requestId } = event.data;

  if (type === "init") {
    if (!ready) await loadPyodide();
    return;
  }

  if (type === "run") {
    if (!ready) {
      self.postMessage({ type: "error", requestId, message: "Pyodide not ready yet" });
      return;
    }
    await runCode(code, testCode, requestId);
  }
};

// Auto-init on load
loadPyodide().catch((err) => {
  self.postMessage({ type: "error", requestId: "init", message: String(err) });
});

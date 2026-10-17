import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { COMPILER_WORKER_SOURCE } from "../src/lib/compiler-worker";
test("the actual worker reports console output and errors without page DOM access", async () => {
  const messages: { type: string; output?: string; error?: string }[] = [];
  const worker = { onmessage: undefined as unknown as (event: unknown) => Promise<void>, postMessage: (message: typeof messages[number]) => messages.push(message) };
  runInNewContext(COMPILER_WORKER_SOURCE, { self: worker, setTimeout, console });
  await worker.onmessage({ data: { language: "javascript", code: 'console.log(typeof document, typeof localStorage); console.log([1, 2]);' } });
  assert.equal(messages[0].type, "ready");
  assert.match(messages[1].output!, /^undefined undefined/);
  await worker.onmessage({ data: { language: "javascript", code: 'throw new Error("expected")' } });
  assert.equal(messages.at(-1)?.error, "Error: expected");
});
test("Python runs in the worker and signals readiness after loading its runtime", async () => {
  const messages: Record<string, unknown>[] = [];
  const worker = { onmessage: undefined as unknown as (event: unknown) => Promise<void>, postMessage: (message: Record<string, unknown>) => messages.push(message) };
  let initialized = false;
  runInNewContext(COMPILER_WORKER_SOURCE, { self: worker, importScripts: (url: string) => assert.match(url, /^https:\/\/cdn\.jsdelivr\.net\/pyodide\//), loadPyodide: async () => { initialized = true; return { runPythonAsync: async (code: string) => { assert.ok(initialized); assert.equal(code, "print(42)"); assert.equal(messages[0]?.type, "ready"); } }; } });
  await worker.onmessage({ data: { language: "python", code: "print(42)" } });
  assert.equal(messages.at(-1)?.type, "result");
});

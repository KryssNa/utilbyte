/** Worker execution keeps loops and DOM access off the page. It is not a security sandbox. */
export const COMPILER_WORKER_SOURCE = `
self.onmessage = async ({ data }) => {
  const logs = [];
  let characters = 0;
  const write = (...args) => {
    const text = args.map(value => { try { return typeof value === "string" ? value : JSON.stringify(value, null, 2) ?? String(value); } catch { return String(value); } }).join(" ");
    characters += text.length;
    if (characters > 100000) throw new Error("Output exceeds 100,000 characters");
    logs.push(text);
  };
  try {
    if (data.language === "python") {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js");
      const python = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/", stdout: write, stderr: write });
      self.postMessage({ type: "ready" });
      await python.runPythonAsync(data.code);
    } else {
      self.postMessage({ type: "ready" });
      const mockConsole = { log: write, error: (...args) => write("[ERROR]", ...args), warn: (...args) => write("[WARN]", ...args), info: write, table: write, clear: () => { logs.length = 0; } };
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      await new AsyncFunction("console", data.code)(mockConsole);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    self.postMessage({ type: "result", output: logs.join("\\n") || "(No output)" });
  } catch (error) {
    self.postMessage({ type: "result", error: "Error: " + (error instanceof Error ? error.message : String(error)) });
  }
};
`;

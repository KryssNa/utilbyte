"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Braces,
  ChevronDown,
  Clock,
  Code2,
  Copy,
  Download,
  Hash,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type RunnerType = "js" | "html" | "css" | "python";

interface Language {
  id: string;
  name: string;
  extension: string;
  template: string;
  runner: RunnerType;
  color: string;
}

const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    runner: "js",
    color: "text-amber-400",
    template: `// JavaScript - Hello World
function greet(name) {
  return \`Hello, \${name}! Welcome to UtilByte Compiler.\`;
}

console.log(greet("World"));

// Arrays & functional methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Destructuring & spread
const [first, ...rest] = numbers;
console.log("First:", first, "Rest:", rest);

// Async example
async function fetchData() {
  return { status: "success", data: [1, 2, 3] };
}

fetchData().then(result => console.log("Result:", JSON.stringify(result)));`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: "ts",
    runner: "js",
    color: "text-sky-400",
    template: `// TypeScript - Runs as JavaScript (types stripped at runtime)

interface User {
  name: string;
  age: number;
  email: string;
}

function createUser(name: string, age: number, email: string): User {
  return { name, age, email };
}

const user: User = createUser("Alice", 30, "alice@example.com");
console.log("User:", JSON.stringify(user, null, 2));

// Generic function
function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<string>("Hello TypeScript!"));
console.log(identity<number>(42));

// Enum-like pattern
const Status = { Active: "active", Inactive: "inactive" } as const;
console.log("Status:", Status.Active);`,
  },
  {
    id: "python",
    name: "Python",
    extension: "py",
    runner: "python",
    color: "text-emerald-400",
    template: `# Python - Hello World
def greet(name):
    return f"Hello, {name}! Welcome to UtilByte Compiler."

print(greet("World"))

# List comprehension
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled:", doubled)

# Dictionary
person = {"name": "Alice", "age": 30, "skills": ["Python", "JS"]}
print(f"Name: {person['name']}, Age: {person['age']}")

# Classes
class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def show_history(self):
        for entry in self.history:
            print(entry)

calc = Calculator()
print("Sum:", calc.add(10, 20))
print("Sum:", calc.add(3, 7))
calc.show_history()

# Lambda & map
squares = list(map(lambda x: x**2, range(1, 6)))
print("Squares:", squares)`,
  },
  {
    id: "html",
    name: "HTML",
    extension: "html",
    runner: "html",
    color: "text-orange-400",
    template: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0ea5e9, #14b8a6);
      color: white;
    }
    .card {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      max-width: 400px;
    }
    h1 { font-size: 2rem; margin-bottom: 12px; }
    p { opacity: 0.9; line-height: 1.6; }
    button {
      margin-top: 20px;
      padding: 10px 24px;
      border: 2px solid white;
      background: transparent;
      color: white;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { background: white; color: #0ea5e9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World</h1>
    <p>Edit this HTML and click Run to see your changes live!</p>
    <button onclick="alert('It works!')">Click Me</button>
  </div>
</body>
</html>`,
  },
  {
    id: "css",
    name: "CSS",
    extension: "css",
    runner: "css",
    color: "text-sky-500",
    template: `/* CSS Art - Pure CSS Loader */
/* The preview shows a centered HTML element with class "demo" */

.demo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Try changing colors and animation speed! */`,
  },
  {
    id: "json",
    name: "JSON",
    extension: "json",
    runner: "js",
    color: "text-teal-400",
    template: `// JSON Validator & Formatter
// Paste your JSON below and run to validate

const data = {
  "name": "UtilByte",
  "version": "1.0.0",
  "features": [
    "PDF Editor",
    "Image Tools",
    "Code Compiler",
    "Developer Utilities"
  ],
  "config": {
    "theme": "dark",
    "language": "en",
    "maxFileSize": "100MB"
  }
};

console.log("Valid JSON:");
console.log(JSON.stringify(data, null, 2));`,
  },
  {
    id: "markdown",
    name: "Markdown",
    extension: "md",
    runner: "html",
    color: "text-gray-400",
    template: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1a1a1a; }
  h1 { border-bottom: 2px solid #0ea5e9; padding-bottom: 8px; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
  blockquote { border-left: 4px solid #0ea5e9; margin: 0; padding: 8px 16px; background: #f0f9ff; }
</style>
</head>
<body>
  <h1>Markdown Preview</h1>
  <p>This is a <strong>Markdown</strong> preview rendered as HTML.</p>
  <blockquote>Edit the HTML to create your markdown-style content!</blockquote>
  <h2>Features</h2>
  <ul>
    <li>Headers and paragraphs</li>
    <li><code>Inline code</code> blocks</li>
    <li>Lists and blockquotes</li>
  </ul>
  <pre><code>console.log("Hello from code block!");</code></pre>
</body>
</html>`,
  },
];

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

const faqs = [
  {
    question: "What languages are supported?",
    answer: "JavaScript, TypeScript, Python, HTML, CSS, JSON, and Markdown. JavaScript and TypeScript run natively. Python runs via Pyodide (a WebAssembly-based Python interpreter).",
  },
  {
    question: "Is Python execution real?",
    answer: "Yes. Python runs using Pyodide, a full CPython interpreter compiled to WebAssembly. It supports most Python standard library features including math, json, re, collections, itertools, and more.",
  },
  {
    question: "Are my files uploaded anywhere?",
    answer: "No. All code runs entirely in your browser. Nothing is sent to any server. Your code stays private on your device.",
  },
  {
    question: "What are the limitations?",
    answer: "JavaScript/TypeScript run in a sandboxed environment without DOM access. Python runs via Pyodide with most stdlib available but no filesystem or network access. HTML/CSS render in a sandboxed iframe.",
  },
  {
    question: "Can I use keyboard shortcuts?",
    answer: "Yes. Press Ctrl+Enter (or Cmd+Enter on Mac) to run your code. Tab inserts 2 spaces for indentation.",
  },
  {
    question: "Why does Python take a moment to load?",
    answer: "The Python interpreter (Pyodide) needs to be downloaded on first use (~6MB). After that it is cached in your browser for instant execution.",
  },
];

const relatedTools = [
  { title: "JSON Formatter", description: "Format & validate JSON", href: "/dev-tools/json-formatter", icon: Braces, category: "dev" as const },
  { title: "Code Beautifier", description: "Format HTML/CSS/JS", href: "/dev-tools/code-beautifier", icon: Code2, category: "dev" as const },
  { title: "Hash Generator", description: "MD5, SHA hashes", href: "/dev-tools/hash-generator", icon: Hash, category: "dev" as const },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
let pyodideInstance: any = null;
let pyodideLoading = false;

export default function OnlineCompiler() {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadPyodide = useCallback(async () => {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoading) {
      while (pyodideLoading) {
        await new Promise((r) => setTimeout(r, 100));
      }
      return pyodideInstance;
    }

    pyodideLoading = true;
    setIsPyodideLoading(true);

    try {
      const script = document.createElement("script");
      script.src = `${PYODIDE_CDN}pyodide.js`;
      document.head.appendChild(script);

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide script"));
      });

      const pyodide = await (window as any).loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      pyodideInstance = pyodide;
      return pyodide;
    } catch (err) {
      console.error("Pyodide load error:", err);
      throw err;
    } finally {
      pyodideLoading = false;
      setIsPyodideLoading(false);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setCode(lang.template);
    setOutput("");
    setHtmlPreview(null);
    setExecutionTime(null);
    setLangMenuOpen(false);
  };

  const runPython = useCallback(async (pythonCode: string): Promise<string> => {
    const pyodide = await loadPyodide();

    pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

    try {
      await pyodide.runPythonAsync(pythonCode);
    } catch (err: any) {
      const stderr = pyodide.runPython("sys.stderr.getvalue()");
      if (stderr) return `Error:\n${stderr}`;
      return `Error: ${err.message || String(err)}`;
    }

    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    let result = stdout || "";
    if (stderr) result += (result ? "\n" : "") + `[stderr] ${stderr}`;
    return result || "(No output)";
  }, [loadPyodide]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setHtmlPreview(null);
    const start = performance.now();

    if (selectedLang.runner === "html" || selectedLang.id === "markdown") {
      setHtmlPreview(code);
      setExecutionTime(performance.now() - start);
      setIsRunning(false);
      return;
    }

    if (selectedLang.runner === "css") {
      const cssHtml = `<!DOCTYPE html>
<html><head><style>
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; font-family: sans-serif; }
  ${code}
</style></head><body><div class="demo"></div></body></html>`;
      setHtmlPreview(cssHtml);
      setExecutionTime(performance.now() - start);
      setIsRunning(false);
      return;
    }

    if (selectedLang.runner === "python") {
      try {
        const result = await runPython(code);
        setOutput(result);
      } catch (err: any) {
        setOutput(`Failed to run Python: ${err.message || String(err)}\n\nMake sure you have an internet connection for the first load.`);
      }
      setExecutionTime(performance.now() - start);
      setIsRunning(false);
      return;
    }

    try {
      const logs: string[] = [];
      const errors: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.map(formatArg).join(" "));
        },
        error: (...args: unknown[]) => {
          errors.push("[ERROR] " + args.map(formatArg).join(" "));
        },
        warn: (...args: unknown[]) => {
          logs.push("[WARN] " + args.map(formatArg).join(" "));
        },
        info: (...args: unknown[]) => {
          logs.push("[INFO] " + args.map(formatArg).join(" "));
        },
        table: (data: unknown) => {
          logs.push(JSON.stringify(data, null, 2));
        },
        clear: () => {
          logs.length = 0;
        },
        time: () => {},
        timeEnd: () => {},
        group: () => {},
        groupEnd: () => {},
      };

      const fn = new Function("console", code);
      fn(mockConsole);

      setTimeout(() => {
        const allOutput = [...logs, ...errors].join("\n");
        setOutput(allOutput || "(No output)");
        setExecutionTime(performance.now() - start);
        setIsRunning(false);
      }, 50);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput(`Error: ${message}`);
      setExecutionTime(performance.now() - start);
      setIsRunning(false);
    }
  }, [code, selectedLang, runPython]);

  const formatArg = (arg: unknown): string => {
    if (arg === null) return "null";
    if (arg === undefined) return "undefined";
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied!");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${selectedLang.extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <ToolLayout
      title="Online Compiler"
      description="Write and run code instantly in your browser. Supports JavaScript, TypeScript, Python, HTML, CSS, and more. No setup required."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Code2}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex flex-col gap-3",
          isFullscreen && "fixed inset-0 z-50 bg-background p-4"
        )}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2">
            <div ref={langMenuRef} className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
              >
                <Code2 className={cn("h-3.5 w-3.5", selectedLang.color)} />
                {selectedLang.name}
                <ChevronDown className={cn("h-3 w-3 transition-transform", langMenuOpen && "rotate-180")} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full left-0 mt-1 z-10 w-56 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer",
                        selectedLang.id === lang.id
                          ? "bg-muted font-medium"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <span className={cn("font-mono text-xs w-8", lang.color)}>.{lang.extension}</span>
                      <span className="flex-1">{lang.name}</span>
                      {lang.runner === "python" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">WASM</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-border" />

            <span className="text-xs text-muted-foreground">
              {lineCount} line{lineCount !== 1 ? "s" : ""}
            </span>

            {selectedLang.runner === "python" && (
              <>
                <div className="w-px h-5 bg-border" />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                  {isPyodideLoading ? "Loading Python..." : pyodideInstance ? "Python Ready" : "Pyodide"}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {executionTime !== null && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {executionTime < 1000 ? `${executionTime.toFixed(1)}ms` : `${(executionTime / 1000).toFixed(2)}s`}
              </span>
            )}

            <Button variant="ghost" size="sm" onClick={downloadCode} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>

            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning || isPyodideLoading}
              className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {isRunning || isPyodideLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPyodideLoading ? "Loading..." : isRunning ? "Running..." : "Run"}
              <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded bg-white/20 px-1.5 font-mono text-[9px]">
                {typeof navigator !== "undefined" && navigator.userAgent.includes("Mac") ? "\u2318" : "Ctrl"}+Enter
              </kbd>
            </Button>
          </div>
        </div>

        {/* Editor & Output */}
        <div
          className="grid gap-3 grid-cols-1 lg:grid-cols-2"
          style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "500px" }}
        >
          {/* Code Editor */}
          <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  code.{selectedLang.extension}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => { setCode(selectedLang.template); toast.success("Reset to template"); }}
                  title="Reset"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => { navigator.clipboard.writeText(code); toast.success("Code copied!"); }}
                  title="Copy"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-0 flex">
                <div className="w-12 shrink-0 py-3 text-right pr-3 select-none overflow-hidden bg-muted/20">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="text-[11px] font-mono text-muted-foreground/40 leading-[1.6rem]">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="flex-1 p-3 bg-transparent text-foreground font-mono text-[13px] leading-[1.6rem] resize-none outline-none overflow-auto"
                  style={{ tabSize: 2 }}
                />
              </div>
            </div>
          </div>

          {/* Output / Preview */}
          <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {htmlPreview !== null ? "Preview" : "Output"}
                </span>
                {selectedLang.runner === "python" && !htmlPreview && (
                  <span className="text-[10px] text-muted-foreground/50">Python {pyodideInstance ? "3.12" : ""}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {output && (
                  <Button variant="ghost" size="icon-sm" onClick={copyOutput} title="Copy output">
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => { setOutput(""); setHtmlPreview(null); }}
                  title="Clear"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              {htmlPreview !== null ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlPreview}
                  sandbox="allow-scripts allow-modals"
                  className="absolute inset-0 w-full h-full bg-white"
                  title="Preview"
                />
              ) : (
                <pre className="absolute inset-0 p-3 font-mono text-[13px] leading-[1.6rem] overflow-auto whitespace-pre-wrap text-foreground/80">
                  {isRunning ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-3 w-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                      {selectedLang.runner === "python" && !pyodideInstance ? "Loading Python interpreter..." : "Executing..."}
                    </span>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-muted-foreground/50">
                      Click &quot;Run&quot; or press Ctrl+Enter to execute your code...
                    </span>
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-card text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl+Enter</kbd>
              Run code
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Tab</kbd>
              Indent
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{languages.length} languages</span>
            <div className="w-px h-3 bg-border" />
            <span>Browser-based execution</span>
          </div>
        </div>
      </motion.div>
    </ToolLayout>
  );
}

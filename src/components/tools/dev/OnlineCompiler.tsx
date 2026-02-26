"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Clock,
  Code2,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  extension: string;
  template: string;
  runner: "js" | "html" | "css";
}

const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    runner: "js",
    template: `// JavaScript - Hello World
function greet(name) {
  return \`Hello, \${name}! Welcome to UtilByte Compiler.\`;
}

console.log(greet("World"));

// Try arrays and objects
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

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
    template: `// TypeScript - Hello World
// Note: Types are stripped at runtime (JS execution)

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
console.log(identity<number>(42));`,
  },
  {
    id: "html",
    name: "HTML",
    extension: "html",
    runner: "html",
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

export default function OnlineCompiler() {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
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

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setCode(lang.template);
    setOutput("");
    setHtmlPreview(null);
    setExecutionTime(null);
    setLangMenuOpen(false);
  };

  const runCode = useCallback(() => {
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
  }, [code, selectedLang]);

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
      description="Write and run code instantly in your browser. Supports JavaScript, TypeScript, HTML, CSS, and more."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Code2}
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
            {/* Language selector */}
            <div ref={langMenuRef} className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
              >
                <Code2 className="h-3.5 w-3.5" />
                {selectedLang.name}
                <ChevronDown className={cn("h-3 w-3 transition-transform", langMenuOpen && "rotate-180")} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full left-0 mt-1 z-10 w-48 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
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
                      <span className="font-mono text-xs text-muted-foreground w-6">.{lang.extension}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-border" />

            <span className="text-xs text-muted-foreground">
              {lineCount} line{lineCount !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {executionTime !== null && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {executionTime.toFixed(1)}ms
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
              disabled={isRunning}
              className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <Play className="h-3.5 w-3.5" />
              {isRunning ? "Running..." : "Run"}
              <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded bg-white/20 px-1.5 font-mono text-[9px]">
                Ctrl+Enter
              </kbd>
            </Button>
          </div>
        </div>

        {/* Editor & Output */}
        <div className={cn(
          "grid gap-3",
          (htmlPreview !== null)
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 lg:grid-cols-2"
        )} style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "500px" }}>
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
                {/* Line numbers */}
                <div className="w-12 shrink-0 py-3 text-right pr-3 select-none overflow-hidden bg-muted/20">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="text-[11px] font-mono text-muted-foreground/40 leading-[1.6rem]">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea */}
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
                  {output || (
                    <span className="text-muted-foreground/50">
                      Click &quot;Run&quot; or press Ctrl+Enter to execute your code...
                    </span>
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ToolLayout>
  );
}

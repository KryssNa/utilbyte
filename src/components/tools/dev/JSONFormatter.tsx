"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Braces,
  Check,
  CheckCircle,
  ChevronDown,
  Copy,
  Download,
  FileText,
  GitCompare,
  Minimize2,
  RotateCcw,
  Search,
  TreePine,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import JsonDiffView from "./json-formatter/JsonDiffView";
import JsonPathBar from "./json-formatter/JsonPathBar";
import JsonTreeView from "./json-formatter/JsonTreeView";
import { SAMPLE_JSON, type ViewTab } from "./json-formatter/types";
import { useJsonFormatter } from "./json-formatter/useJsonFormatter";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [compareInput, setCompareInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [activeTab, setActiveTab] = useState<ViewTab>("formatted");
  const [searchTerm, setSearchTerm] = useState("");
  const [jsonPath, setJsonPath] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { formatted, error, isValid, stats, parsed } = useJsonFormatter(input, indentSize);

  const compareResult = useJsonFormatter(compareInput, indentSize);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleMinify = useCallback(() => {
    if (!parsed) return;
    const minified = JSON.stringify(parsed);
    setInput(minified);
    toast.success("JSON minified!");
  }, [parsed]);

  const handleSort = useCallback(() => {
    if (!parsed) return;

    function sortKeys(obj: unknown): unknown {
      if (Array.isArray(obj)) return obj.map(sortKeys);
      if (typeof obj === "object" && obj !== null) {
        return Object.keys(obj as Record<string, unknown>)
          .sort()
          .reduce((acc: Record<string, unknown>, key) => {
            acc[key] = sortKeys((obj as Record<string, unknown>)[key]);
            return acc;
          }, {});
      }
      return obj;
    }

    const sorted = JSON.stringify(sortKeys(parsed), null, indentSize);
    setInput(sorted);
    toast.success("Keys sorted alphabetically!");
  }, [parsed, indentSize]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      toast.success(`Imported "${file.name}"`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDownload = useCallback(
    (type: "json" | "minified") => {
      if (!formatted) return;
      const content = type === "minified" ? JSON.stringify(parsed) : formatted;
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "minified" ? "data.min.json" : "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${type === "minified" ? "Minified" : "Formatted"} JSON downloaded!`);
      setShowExport(false);
    },
    [formatted, parsed]
  );

  const highlightedOutput = useMemo(() => {
    if (!formatted) return null;

    return formatted.split("\n").map((line, i) => {
      let highlighted = line;
      highlighted = highlighted.replace(
        /("(?:[^"\\]|\\.)*")(\s*:)/g,
        '<span class="text-sky-400">$1</span>$2'
      );
      highlighted = highlighted.replace(
        /:\s*("(?:[^"\\]|\\.)*")/g,
        (match, val) => match.replace(val, `<span class="text-emerald-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(\d+\.?\d*)/g,
        (match, val) => match.replace(val, `<span class="text-amber-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(true|false)/g,
        (match, val) => match.replace(val, `<span class="text-orange-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(null)/g,
        (match, val) => match.replace(val, `<span class="text-rose-400">${val}</span>`)
      );

      const matchesSearch =
        searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        <div
          key={i}
          className={cn(
            "flex gap-3 px-3 py-0 leading-6 hover:bg-muted/30",
            matchesSearch && "bg-amber-500/10"
          )}
        >
          <span className="text-muted-foreground/40 w-8 text-right select-none shrink-0 text-xs leading-6">
            {i + 1}
          </span>
          <span
            className="flex-1 whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      );
    });
  }, [formatted, searchTerm]);

  const faqs = [
    {
      question: "What is JSON formatting?",
      answer:
        "JSON formatting transforms compact JSON into a readable, properly indented structure with syntax highlighting. It makes data easier to read, debug, and understand.",
    },
    {
      question: "Does this tool validate JSON?",
      answer:
        "Yes. The formatter validates your JSON in real-time and displays precise error locations with context to help you fix issues quickly.",
    },
    {
      question: "What is the JSON Path feature?",
      answer:
        "JSON Path lets you query specific values using dot notation (e.g., address.city or projects[0].name). Results are shown instantly as you type the path.",
    },
    {
      question: "Can I compare two JSON objects?",
      answer:
        "Yes. Switch to the Compare tab and paste a second JSON to see a line-by-line diff with color-coded additions, removals, and modifications.",
    },
    {
      question: "Is my data stored or sent anywhere?",
      answer:
        "No. All processing happens entirely in your browser. Your data never leaves your device.",
    },
    {
      question: "What keyboard shortcuts are available?",
      answer:
        "Ctrl+Enter to format, Ctrl+Shift+M to minify. The input field also supports Tab for indentation.",
    },
  ];

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, minify, compare, and explore JSON with syntax highlighting, tree view, and JSON Path queries."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Braces}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode Base64", href: "/dev-tools/base64", icon: Braces, category: "dev" },
        { title: "JWT Decoder", description: "Decode JSON Web Tokens", href: "/dev-tools/jwt-decoder", icon: Braces, category: "dev" },
        { title: "Diff Checker", description: "Compare text & code", href: "/dev-tools/diff-checker", icon: Braces, category: "dev" },
      ]}
    >
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt"
          onChange={handleImport}
          className="hidden"
        />

        {/* Top Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Indent Size Selector */}
            <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5">
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setIndentSize(size)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    indentSize === size
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {size}sp
                </button>
              ))}
              <button
                onClick={() => setIndentSize(8)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  indentSize === 8
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tab
              </button>
            </div>

            <div className="h-5 w-px bg-border hidden sm:block" />

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3 w-3" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => setInput(JSON.stringify(SAMPLE_JSON))}
            >
              <FileText className="h-3 w-3" />
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => {
                setInput("");
                setCompareInput("");
                setJsonPath("");
                setSearchTerm("");
                toast.success("Cleared");
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Validation Status */}
            {input.trim() && (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium",
                  isValid ? "text-emerald-500" : "text-red-500"
                )}
              >
                {isValid ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isValid ? "Valid" : "Invalid"}
                </span>
              </div>
            )}

            {formatted && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={handleMinify}
                >
                  <Minimize2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Minify</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={handleSort}
                >
                  Sort
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => handleCopy(formatted, "JSON")}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  Copy
                </Button>

                <div className="relative" ref={exportRef}>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setShowExport(!showExport)}
                  >
                    <Download className="h-3 w-3" />
                    Export
                    <ChevronDown
                      className={cn("h-3 w-3 transition-transform", showExport && "rotate-180")}
                    />
                  </Button>
                  {showExport && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                      <button
                        onClick={() => handleDownload("json")}
                        className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                      >
                        Formatted (.json)
                      </button>
                      <button
                        onClick={() => handleDownload("minified")}
                        className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                      >
                        Minified (.min.json)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {isValid && stats.keys > 0 ? (
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            <span>{stats.keys} keys</span>
            <span className="text-border">|</span>
            <span>{stats.depth} deep</span>
            <span className="text-border">|</span>
            <span>{stats.objects} obj</span>
            <span className="text-border">|</span>
            <span>{stats.arrays} arr</span>
            <span className="text-border">|</span>
            <span>{stats.strings} str</span>
            <span className="text-border">|</span>
            <span>{stats.numbers} num</span>
            <span className="text-border">|</span>
            <span>
              {stats.size < 1024
                ? `${stats.size} B`
                : `${(stats.size / 1024).toFixed(1)} KB`}
            </span>
            <div className="ml-auto">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors",
                  showSearch ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <Search className="h-3 w-3" />
                Search
              </button>
            </div>
          </div>
        ) : null}

        {/* Search Bar */}
        {showSearch && isValid && parsed && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys and values..."
              className="flex-1 bg-transparent outline-none text-xs font-mono placeholder:text-muted-foreground/50"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* JSON Path Bar */}
        {isValid && parsed && <JsonPathBar parsed={parsed} path={jsonPath} onPathChange={setJsonPath} />}

        {/* Error Detail */}
        {!isValid && error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
                {error}
              </pre>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5 w-fit">
          <button
            onClick={() => setActiveTab("formatted")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === "formatted"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Braces className="h-3.5 w-3.5" />
            Formatted
          </button>
          <button
            onClick={() => setActiveTab("tree")}
            disabled={!parsed}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === "tree"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              !parsed && "opacity-40 cursor-not-allowed"
            )}
          >
            <TreePine className="h-3.5 w-3.5" />
            Tree
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === "compare"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </button>
        </div>

        {/* Main Content Area */}
        <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
          {activeTab === "formatted" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Input */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Input
                  </span>
                  {input && (
                    <span className="text-[10px] text-muted-foreground">
                      {input.length.toLocaleString()} chars
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={'Paste your JSON here...\n\n{\n  "key": "value"\n}'}
                    className="w-full min-h-[400px] font-mono text-sm bg-transparent resize-none p-4 outline-none placeholder:text-muted-foreground/50 leading-relaxed"
                    spellCheck={false}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        setInput(input.substring(0, start) + "  " + input.substring(end));
                        requestAnimationFrame(() => {
                          if (inputRef.current) {
                            inputRef.current.selectionStart = start + 2;
                            inputRef.current.selectionEnd = start + 2;
                          }
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Formatted Output
                  </span>
                  {formatted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(formatted, "JSON")}
                      className="h-5 px-2 text-[10px] gap-1"
                    >
                      <Copy className="h-2.5 w-2.5" />
                      Copy
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-auto min-h-[400px]">
                  {highlightedOutput ? (
                    <div className="font-mono text-sm py-2">
                      {highlightedOutput}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-20">
                      Formatted output will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tree" && (
            <div className="p-4 overflow-auto min-h-[400px] max-h-[600px]">
              <JsonTreeView
                data={parsed}
                searchTerm={searchTerm}
                onPathClick={(p) => {
                  setJsonPath(p.startsWith("$.") ? p.slice(2) : p === "$" ? "" : p);
                  toast.success(`Path: ${p}`);
                }}
              />
            </div>
          )}

          {activeTab === "compare" && (
            <div className="space-y-0">
              <div className="p-3 border-b border-border bg-muted/30">
                <textarea
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  placeholder="Paste second JSON here to compare..."
                  className="w-full min-h-[100px] max-h-[200px] font-mono text-sm bg-background border border-border rounded-lg resize-none p-3 outline-none placeholder:text-muted-foreground/50 leading-relaxed focus:border-primary/50"
                  spellCheck={false}
                />
              </div>
              <div className="p-4">
                <JsonDiffView left={formatted} right={compareResult.formatted} />
              </div>
            </div>
          )}
        </div>
      </div>

      <ContentCluster
        category="dev"
        title="Complete Developer Tools Suite"
        description="Essential tools for developers: format code, validate data, encode/decode, and debug applications."
        mainTool={{
          title: "JSON Formatter",
          href: "/dev-tools/json-formatter",
          description: "Format, validate, and beautify JSON data with syntax checking.",
        }}
        topics={[
          { title: "Base64 Encoder/Decoder", description: "Encode and decode Base64 strings", href: "/dev-tools/base64", type: "tool", category: "Developer Tools" },
          { title: "UUID Generator", description: "Generate RFC 4122 compliant unique identifiers", href: "/dev-tools/uuid-generator", type: "tool", category: "Developer Tools" },
          { title: "JWT Decoder", description: "Decode and inspect JSON Web Tokens", href: "/dev-tools/jwt-decoder", type: "tool", category: "Developer Tools" },
          { title: "Hash Generator", description: "Generate MD5, SHA-256, SHA-512 hashes", href: "/dev-tools/hash-generator", type: "tool", category: "Developer Tools" },
          { title: "Diff Checker", description: "Compare two text snippets or code files", href: "/dev-tools/diff-checker", type: "tool", category: "Developer Tools" },
          { title: "Regex Tester", description: "Test and debug regular expressions live", href: "/dev-tools/regex-tester", type: "tool", category: "Developer Tools" },
        ]}
      />
    </ToolLayout>
  );
}

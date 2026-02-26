"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import MarkdownToolbar from "./markdown/MarkdownToolbar";
import MarkdownPreview from "./markdown/MarkdownPreview";
import MarkdownTOC from "./markdown/MarkdownTOC";
import { useMarkdownStats } from "./markdown/useMarkdownStats";
import { defaultMarkdown } from "./markdown/defaultContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  FileText,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import "highlight.js/styles/github-dark.css";

type ViewMode = "split" | "editor" | "preview";

export default function MarkdownRenderer() {
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [split, setSplit] = useState(50);
  const [showTOC, setShowTOC] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const stats = useMarkdownStats(content);

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

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setContent(text);
      toast.success(`Imported "${file.name}"`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const generateHTML = useCallback(() => {
    const preview = document.querySelector("[data-md-preview]");
    const html = preview?.innerHTML || "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a1a; }
    h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3rem; }
    pre { background: #0d1117; color: #e6edf3; border-radius: 8px; padding: 1rem; overflow-x: auto; }
    code { background: #f3f4f6; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; color: #6b7280; margin: 1rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #e5e7eb; padding: 0.6rem 1rem; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    img { max-width: 100%; border-radius: 8px; }
    a { color: #2563eb; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
  </style>
</head>
<body>${html}</body>
</html>`;
  }, []);

  const downloadFile = useCallback(
    (filename: string, contentStr: string, type: string) => {
      const blob = new Blob([contentStr], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  const handleDownloadMD = useCallback(() => {
    if (!content) return;
    downloadFile("document.md", content, "text/markdown");
    toast.success("Markdown file downloaded!");
    setShowExport(false);
  }, [content, downloadFile]);

  const handleDownloadHTML = useCallback(() => {
    if (!content) return;
    downloadFile("document.html", generateHTML(), "text/html");
    toast.success("HTML file downloaded!");
    setShowExport(false);
  }, [content, generateHTML, downloadFile]);

  const handleDownloadTxt = useCallback(() => {
    if (!content) return;
    const plain = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/~~(.*?)~~/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ""))
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
    downloadFile("document.txt", plain, "text/plain");
    toast.success("Text file downloaded!");
    setShowExport(false);
  }, [content, downloadFile]);

  const wrapSelection = useCallback(
    (prefix: string, suffix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const newText =
        content.substring(0, start) +
        prefix +
        (selected || "text") +
        suffix +
        content.substring(end);
      setContent(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + (selected || "text").length
        );
      });
    },
    [content]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") {
          e.preventDefault();
          wrapSelection("**", "**");
        } else if (e.key === "i") {
          e.preventDefault();
          wrapSelection("*", "*");
        } else if (e.key === "s") {
          e.preventDefault();
          if (content) {
            downloadFile("document.md", content, "text/markdown");
            toast.success("Markdown file downloaded!");
          }
        }
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newValue = content.substring(0, start) + "  " + content.substring(end);
        setContent(newValue);
        requestAnimationFrame(() => {
          textareaRef.current?.setSelectionRange(start + 2, start + 2);
        });
      }
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener("keydown", handleKeyDown);
    return () => textarea?.removeEventListener("keydown", handleKeyDown);
  }, [content, wrapSelection, downloadFile]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(80, Math.max(20, pct)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleTouchStart = useCallback(() => {
    const onTouchMove = (ev: TouchEvent) => {
      if (!containerRef.current) return;
      const touch = ev.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((touch.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(80, Math.max(20, pct)));
    };
    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, []);

  const editorVisible = viewMode === "split" || viewMode === "editor";
  const previewVisible = viewMode === "split" || viewMode === "preview";

  const faqs = [
    {
      question: "What markdown features are supported?",
      answer:
        "Full GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, fenced code blocks with multi-language syntax highlighting, blockquotes, images, links, and more.",
    },
    {
      question: "Can I import markdown files?",
      answer:
        "Yes. Click the Import button to open any .md or .txt file from your computer. The content loads instantly into the editor.",
    },
    {
      question: "What export formats are available?",
      answer:
        "You can export as Markdown (.md), HTML (.html) with full styling and syntax highlighting, or plain text (.txt) with formatting stripped.",
    },
    {
      question: "Does it support keyboard shortcuts?",
      answer:
        "Yes. Ctrl+B for bold, Ctrl+I for italic, Ctrl+S to save as markdown, and Tab for indentation. The formatting toolbar also provides quick access to all markdown syntax.",
    },
    {
      question: "Is the preview updated in real-time?",
      answer:
        "Yes, the preview updates instantly as you type with beautiful formatting, syntax highlighting, and proper table rendering.",
    },
    {
      question: "Is my data private?",
      answer:
        "Everything runs 100% in your browser. Your markdown content is never sent to any server or stored anywhere.",
    },
  ];

  return (
    <ToolLayout
      title="Markdown Renderer"
      description="Advanced markdown editor with live preview, formatting toolbar, syntax highlighting, table of contents, and multiple export formats."
      category="dev"
      categoryLabel="Developer Tools"
      icon={FileText}
      faqs={faqs}
      relatedTools={[
        {
          title: "Code Beautifier",
          description: "Format HTML/CSS/JS code",
          href: "/dev-tools/code-beautifier",
          icon: FileText,
          category: "dev",
        },
        {
          title: "Diff Checker",
          description: "Compare text side-by-side",
          href: "/dev-tools/diff-checker",
          icon: FileText,
          category: "dev",
        },
        {
          title: "JSON Formatter",
          description: "Format and validate JSON",
          href: "/dev-tools/json-formatter",
          icon: FileText,
          category: "dev",
        },
      ]}
    >
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.markdown"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Top Action Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setViewMode("editor")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                viewMode === "editor"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                viewMode === "split"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GripVertical className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                viewMode === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
              onClick={() => setContent(defaultMarkdown)}
            >
              <FileText className="h-3 w-3" />
              Example
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => {
                setContent("");
                toast.success("Editor cleared");
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </Button>

            {content && (
              <>
                <div className="h-5 w-px bg-border hidden sm:block" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => handleCopy(content, "Markdown")}
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
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showExport && "rotate-180")} />
                  </Button>
                  {showExport && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                      <button
                        onClick={handleDownloadMD}
                        className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                      >
                        Markdown (.md)
                      </button>
                      <button
                        onClick={handleDownloadHTML}
                        className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                      >
                        HTML (.html)
                      </button>
                      <button
                        onClick={handleDownloadTxt}
                        className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                      >
                        Plain Text (.txt)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {content && (
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            <span>{stats.words} words</span>
            <span className="text-border">|</span>
            <span>{stats.characters} chars</span>
            <span className="text-border">|</span>
            <span>{stats.lines} lines</span>
            <span className="text-border">|</span>
            <span>{stats.headings} headings</span>
            <span className="text-border">|</span>
            <span>{stats.codeBlocks} code blocks</span>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {stats.readingTime} read
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setShowTOC(!showTOC)}
                className={cn(
                  "text-xs px-2 py-0.5 rounded transition-colors",
                  showTOC ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                TOC
              </button>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex gap-3">
          {/* TOC Sidebar */}
          {showTOC && content && (
            <div className="hidden lg:block w-48 shrink-0 rounded-xl border border-border bg-card overflow-auto max-h-[600px]">
              <MarkdownTOC content={content} />
            </div>
          )}

          {/* Editor + Preview */}
          <div
            ref={containerRef}
            className="relative flex flex-1 gap-0 rounded-xl border border-border overflow-hidden bg-muted/20"
            style={{ minHeight: 520 }}
          >
            {/* Editor Panel */}
            {editorVisible && (
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  width: viewMode === "split" ? `${split}%` : "100%",
                  minWidth: 0,
                }}
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Editor
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    Ctrl+B Bold / Ctrl+I Italic / Ctrl+S Save
                  </span>
                </div>
                <MarkdownToolbar
                  textareaRef={textareaRef}
                  value={content}
                  onChange={setContent}
                />
                <div className="flex-1 overflow-auto">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={"Start writing markdown here...\n\nUse the toolbar above or type markdown syntax directly.\nClick 'Example' to load sample content."}
                    className="w-full h-full min-h-[440px] font-mono text-sm bg-transparent resize-none p-4 outline-none placeholder:text-muted-foreground/50 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Resize Handle */}
            {viewMode === "split" && (
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="group relative flex w-1.5 flex-col items-center justify-center bg-border hover:bg-primary/40 cursor-col-resize shrink-0 transition-colors duration-150 select-none"
                title="Drag to resize"
              >
                <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-80 transition-opacity">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-foreground" />
                  ))}
                </div>
              </div>
            )}

            {/* Preview Panel */}
            {previewVisible && (
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  width: viewMode === "split" ? `${100 - split}%` : "100%",
                  minWidth: 0,
                }}
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Preview
                  </span>
                  {content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(generateHTML(), "HTML")}
                      className="h-5 px-2 text-[10px] gap-1"
                    >
                      <Copy className="h-2.5 w-2.5" />
                      Copy HTML
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-auto p-5" data-md-preview>
                  <MarkdownPreview content={content} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

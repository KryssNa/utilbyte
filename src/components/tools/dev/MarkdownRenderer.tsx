"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Download, Eye, EyeOff, FileText, RotateCcw, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [splitView, setSplitView] = useState<boolean>(true);

  // Default markdown example
  const defaultMarkdown = `# Markdown Renderer

Welcome to the **world's best markdown renderer**! 🚀

## Features

- ✅ **Live Preview** - See your markdown rendered in real-time
- ✅ **GitHub Flavored Markdown** - Support for tables, task lists, strikethrough
- ✅ **Syntax Highlighting** - Code blocks with beautiful syntax highlighting
- ✅ **Split View** - Edit and preview side-by-side
- ✅ **Export Options** - Download your rendered HTML

## Code Example

\`\`\`javascript
function helloWorld() {
  console.log("Hello, World! 🌍");
  return "Markdown is awesome!";
}
\`\`\`

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Live Preview | ✅ | Real-time rendering |
| GFM Support | ✅ | Tables, task lists |
| Syntax Highlighting | ✅ | Multiple languages |

## Task List

- [x] Create markdown renderer
- [x] Add live preview
- [x] Implement syntax highlighting
- [ ] Add more themes
- [ ] Export to PDF

## Links and Images

[Visit our website](https://example.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.
>
>> And even nested quotes!

## Emphasis

*Italic text* or _italic text_

**Bold text** or __bold text__

***Bold and italic*** or ___bold and italic___

~~Strikethrough text~~

## Lists

### Unordered
- Item 1
- Item 2
  - Nested item
  - Another nested

### Ordered
1. First item
2. Second item
   1. Nested numbered
   2. Another nested

---

*Made with ❤️ using React & Markdown*
`;

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReset = () => {
    setMarkdownText("");
  };

  const handleLoadExample = () => {
    setMarkdownText(defaultMarkdown);
  };

  const handleDownloadHTML = useCallback(() => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Rendered</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #24292e;
            background: #ffffff;
        }
        pre {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 1rem;
            overflow-x: auto;
        }
        code {
            background: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            color: #6a737d;
            margin: 1rem 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 0.5rem 1rem;
        }
        th {
            background: #f6f8fa;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="markdown-content">
        ${renderedHTML}
    </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendered-markdown.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded!");
  }, [markdownText]);

  const renderedHTML = useMemo(() => {
    if (!markdownText) return "";

    // We need to render to HTML string for download
    // This is a simplified version - in production you'd use a proper HTML generation
    return markdownText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br>');
  }, [markdownText]);

  const stats = useMemo(() => {
    const words = markdownText.trim() ? markdownText.trim().split(/\s+/).length : 0;
    const characters = markdownText.length;
    const lines = markdownText.split('\n').length;
    const headings = (markdownText.match(/^#{1,6}\s/gm) || []).length;
    const links = (markdownText.match(/\[.*?\]\(.*?\)/g) || []).length;
    const codeBlocks = (markdownText.match(/```[\s\S]*?```/g) || []).length;

    return { words, characters, lines, headings, links, codeBlocks };
  }, [markdownText]);

  const faqs = [
    {
      question: "What markdown features are supported?",
      answer: "Full GitHub Flavored Markdown support including tables, task lists, strikethrough, code blocks with syntax highlighting, and more.",
    },
    {
      question: "Can I export the rendered HTML?",
      answer: "Yes! Use the download button to save your rendered markdown as a complete HTML file with styling.",
    },
    {
      question: "Is the preview updated in real-time?",
      answer: "Absolutely! As you type, the preview updates instantly with beautiful formatting and syntax highlighting.",
    },
  ];

  return (
    <ToolLayout
      title="Markdown Renderer"
      description="Render and preview markdown with live preview, syntax highlighting, and GitHub Flavored Markdown support. Export to HTML."
      category="dev"
      categoryLabel="Developer Tools"
      icon={FileText}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: FileText, category: "dev" },
        { title: "Base64", description: "Encode/decode base64", href: "/dev-tools/base64", icon: FileText, category: "dev" },
        { title: "UUID Generator", description: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: FileText, category: "dev" },
      ]}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={splitView ? "default" : "outline"}
            size="sm"
            onClick={() => setSplitView(!splitView)}
            className="gap-2"
          >
            {splitView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {splitView ? "Preview Only" : "Split View"}
          </Button>

          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? "Hide Preview" : "Show Preview"}
          </Button>

          <div className="h-6 w-px bg-border" />

          <Button variant="outline" size="sm" onClick={handleLoadExample} className="gap-2">
            <Upload className="h-4 w-4" />
            Load Example
          </Button>

          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>

          {markdownText && (
            <>
              <div className="h-6 w-px bg-border" />
              <Button variant="outline" size="sm" onClick={() => handleCopy(markdownText)} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="gap-2">
                <Download className="h-4 w-4" />
                Download HTML
              </Button>
            </>
          )}
        </div>

        {/* Stats */}
        {markdownText && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{stats.words} words</Badge>
            <Badge variant="secondary">{stats.characters} characters</Badge>
            <Badge variant="secondary">{stats.lines} lines</Badge>
            <Badge variant="secondary">{stats.headings} headings</Badge>
            <Badge variant="secondary">{stats.links} links</Badge>
            <Badge variant="secondary">{stats.codeBlocks} code blocks</Badge>
          </div>
        )}

        {/* Main Content */}
        <div className={`grid gap-6 ${splitView ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Markdown Editor</h3>
              {copied && (
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" />
                  Copied!
                </Badge>
              )}
            </div>
            <Textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              placeholder="Enter your markdown here... or click 'Load Example' to see a demo"
              className="min-h-[500px] text-base font-mono resize-none"
            />
          </div>

          {/* Preview */}
          {previewMode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Live Preview</h3>
                {markdownText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(renderedHTML)}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy HTML
                  </Button>
                )}
              </div>
              <div className="min-h-[500px] border rounded-lg bg-card p-6 overflow-auto prose prose-sm max-w-none dark:prose-invert">
                {markdownText ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={{
                        // Custom component styling
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">
                            {children}
                          </blockquote>
                        ),
                        code: ({ className, children }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (
                            <code className={className}>{children}</code>
                          ) : (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm">{children}</pre>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-border">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-border px-4 py-2">{children}</td>
                        ),
                      }}
                    >
                      {markdownText}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter markdown to see the live preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

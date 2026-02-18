"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type CodeType = "html" | "css" | "javascript";

export default function CodeBeautifier() {
  const [input, setInput] = useState<string>("");
  const [codeType, setCodeType] = useState<CodeType>("html");
  const [copied, setCopied] = useState<boolean>(false);

  const formatHTML = (html: string): string => {
    if (!html.trim()) return "";

    let formatted = html;
    let indent = 0;
    const lines: string[] = [];
    const tokens = formatted.split(/(<[^>]+>)/g).filter(t => t.trim());

    tokens.forEach(token => {
      if (token.match(/^<\//) || token.match(/^<[^>]+\/>$/)) {
        if (token.match(/^<\//)) indent--;
        lines.push('  '.repeat(Math.max(0, indent)) + token);
      } else if (token.match(/^</)) {
        lines.push('  '.repeat(indent) + token);
        if (!token.match(/^<(br|hr|img|input|meta|link)/)) indent++;
      } else if (token.trim()) {
        lines.push('  '.repeat(indent) + token.trim());
      }
    });

    return lines.join('\n');
  };

  const formatCSS = (css: string): string => {
    if (!css.trim()) return "";

    return css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/,\s*/g, ',\n')
      .trim();
  };

  const formatJavaScript = (js: string): string => {
    if (!js.trim()) return "";

    let formatted = js;
    let indent = 0;
    const lines: string[] = [];
    const tokens = formatted.split(/([{};])/g);

    tokens.forEach(token => {
      const trimmed = token.trim();
      if (!trimmed) return;

      if (trimmed === '}') {
        indent = Math.max(0, indent - 1);
        lines.push('  '.repeat(indent) + trimmed);
      } else if (trimmed === '{') {
        lines.push('  '.repeat(indent) + (lines.length > 0 ? trimmed : token));
        indent++;
      } else if (trimmed === ';') {
        if (lines.length > 0) {
          lines[lines.length - 1] += ';';
        }
      } else {
        lines.push('  '.repeat(indent) + trimmed);
      }
    });

    return lines.join('\n').replace(/\n{3,}/g, '\n\n');
  };

  const getFormattedCode = (): string => {
    switch (codeType) {
      case "html":
        return formatHTML(input);
      case "css":
        return formatCSS(input);
      case "javascript":
        return formatJavaScript(input);
      default:
        return input;
    }
  };

  const formatted = getFormattedCode();

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast.success("Formatted code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const handleReset = () => {
    setInput("");
  };

  const getSample = (type: CodeType): string => {
    const samples = {
      html: '<div class="container"><h1>Hello World</h1><p>This is a paragraph.</p></div>',
      css: 'body{margin:0;padding:0;font-family:Arial,sans-serif;}h1{color:#333;font-size:24px;}',
      javascript: 'function hello(){const name="World";console.log(`Hello ${name}`);}hello();'
    };
    return samples[type];
  };

  const handleSample = () => {
    setInput(getSample(codeType));
  };

  const faqs = [
    {
      question: "What code formats are supported?",
      answer: "Currently supports HTML, CSS, and JavaScript beautification with proper indentation and formatting.",
    },
    {
      question: "Does this minify code?",
      answer: "No, this tool beautifies (formats) code. It adds spacing and indentation to make code more readable.",
    },
    {
      question: "Is my code stored anywhere?",
      answer: "No. All code formatting happens in your browser. Your code never leaves your device.",
    },
  ];

  return (
    <ToolLayout
      title="Code Beautifier"
      description="Format and beautify HTML, CSS, and JavaScript code online. Make your code clean and readable with proper indentation."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Code2}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Code2, category: "dev" },
        { title: "SQL Formatter", description: "Format SQL queries", href: "/dev-tools/sql-formatter", icon: Code2, category: "dev" },
        { title: "Markdown Renderer", description: "Render markdown", href: "/dev-tools/markdown-renderer", icon: Code2, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        <Tabs value={codeType} onValueChange={(v) => setCodeType(v as CodeType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Input Code</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSample}>
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </Button>
              </div>
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${codeType.toUpperCase()} code here...`}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Formatted Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!formatted}
                className="gap-2"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </Button>
            </div>

            <div className="relative">
              <Textarea
                value={formatted}
                readOnly
                placeholder="Formatted code will appear here..."
                className="min-h-[400px] font-mono text-sm bg-muted/30"
              />
            </div>

            {formatted && (
              <div className="text-xs text-muted-foreground text-center">
                Code formatted with 2-space indentation
              </div>
            )}
          </div>
        </div>
      </div>

      <ContentCluster
        category="dev"
        title="Complete Code Formatting Suite"
        description="Essential tools for developers: format code, validate data, and debug applications efficiently."
        mainTool={{
          title: "Advanced Code Beautifier",
          href: "/dev-tools/code-beautifier",
          description: "Format HTML, CSS, and JavaScript with proper indentation. Essential for clean, maintainable code."
        }}
        topics={[
          {
            title: "JSON Formatter",
            description: "Format and validate JSON data structures",
            href: "/dev-tools/json-formatter",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "SQL Formatter",
            description: "Beautify SQL queries for better readability",
            href: "/dev-tools/sql-formatter",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "Markdown Renderer",
            description: "Preview and render markdown content",
            href: "/dev-tools/markdown-renderer",
            type: "tool",
            category: "Developer Tools"
          }
        ]}
      />
    </ToolLayout>
  );
}

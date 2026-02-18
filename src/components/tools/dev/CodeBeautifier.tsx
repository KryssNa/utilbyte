"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import ResizableEditor from "./ResizableEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    let indent = 0;
    const lines: string[] = [];
    const tokens = html.split(/(<[^>]+>)/g).filter(t => t.trim());
    tokens.forEach(token => {
      if (token.match(/^<\//)) {
        indent = Math.max(0, indent - 1);
        lines.push('  '.repeat(indent) + token);
      } else if (token.match(/^<[^>]+\/>$/)) {
        lines.push('  '.repeat(indent) + token);
      } else if (token.match(/^</)) {
        lines.push('  '.repeat(indent) + token);
        if (!token.match(/^<(br|hr|img|input|meta|link)/i)) indent++;
      } else if (token.trim()) {
        lines.push('  '.repeat(indent) + token.trim());
      }
    });
    return lines.join('\n');
  };

  const formatCSS = (css: string): string => {
    if (!css.trim()) return "";
    return css
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/,\s*(?=[^\n])/g, ',\n')
      .replace(/  \n\}/g, '\n}')
      .trim();
  };

  const formatJavaScript = (js: string): string => {
    if (!js.trim()) return "";
    let indent = 0;
    const result: string[] = [];
    const lines = js.replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n').split('\n');
    lines.forEach(line => {
      const t = line.trim();
      if (!t) return;
      if (t === '}' || t === '};') indent = Math.max(0, indent - 1);
      result.push('  '.repeat(indent) + t);
      if (t.endsWith('{')) indent++;
    });
    return result.join('\n').replace(/\n{3,}/g, '\n\n');
  };

  const getFormatted = (): string => {
    switch (codeType) {
      case "html": return formatHTML(input);
      case "css": return formatCSS(input);
      case "javascript": return formatJavaScript(input);
    }
  };

  const formatted = getFormatted();

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast.success("Formatted code copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const getSample = (type: CodeType): string => ({
    html: '<div class="container"><h1>Hello World</h1><p>A paragraph with <strong>bold</strong> text.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>',
    css: 'body{margin:0;padding:0;font-family:Arial,sans-serif;}h1{color:#333;font-size:24px;}.container{max-width:1200px;margin:0 auto;padding:0 16px;}',
    javascript: 'function greet(name){const msg=`Hello ${name}`;console.log(msg);return msg;}const result=greet("World");console.log(result);',
  })[type];

  const faqs = [
    { question: "What languages are supported?", answer: "HTML, CSS, and JavaScript with proper indentation and formatting." },
    { question: "Is my code stored anywhere?", answer: "No. All formatting happens in your browser. Your code never leaves your device." },
  ];

  return (
    <ToolLayout
      title="Code Beautifier"
      description="Format and beautify HTML, CSS, and JavaScript code online with proper indentation."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Code2}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Code2, category: "dev" },
        { title: "Diff Checker", description: "Compare text & code", href: "/dev-tools/diff-checker", icon: Code2, category: "dev" },
        { title: "SQL Formatter", description: "Format SQL queries", href: "/dev-tools/sql-formatter", icon: Code2, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Tabs value={codeType} onValueChange={(v) => setCodeType(v as CodeType)}>
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(getSample(codeType))}>
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </div>

        <ResizableEditor
          left={{
            label: `Input ${codeType.toUpperCase()}`,
            children: (
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your ${codeType.toUpperCase()} code here…`}
                className="w-full h-full min-h-[380px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
                spellCheck={false}
              />
            ),
          }}
          right={{
            label: "Formatted Output",
            actions: (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!formatted}
                className="h-6 px-2 text-xs gap-1"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            ),
            children: (
              <Textarea
                value={formatted}
                readOnly
                placeholder="Formatted code will appear here…"
                className="w-full h-full min-h-[380px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
                spellCheck={false}
              />
            ),
          }}
        />
      </div>
    </ToolLayout>
  );
}

"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import ResizableEditor from "./ResizableEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GitCompare, RotateCcw, ArrowLeftRight } from "lucide-react";
import { useState, useMemo } from "react";

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNum: number;
}

export default function DiffChecker() {
  const [leftText, setLeftText] = useState<string>("");
  const [rightText, setRightText] = useState<string>("");

  const diff = useMemo((): DiffLine[] => {
    if (!leftText && !rightText) return [];
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const result: DiffLine[] = [];
    const maxLines = Math.max(leftLines.length, rightLines.length);

    for (let i = 0; i < maxLines; i++) {
      const l = leftLines[i];
      const r = rightLines[i];
      if (l === undefined) {
        result.push({ type: 'added', content: r || '', lineNum: i + 1 });
      } else if (r === undefined) {
        result.push({ type: 'removed', content: l || '', lineNum: i + 1 });
      } else if (l === r) {
        result.push({ type: 'unchanged', content: l, lineNum: i + 1 });
      } else {
        result.push({ type: 'removed', content: l, lineNum: i + 1 });
        result.push({ type: 'added', content: r, lineNum: i + 1 });
      }
    }
    return result;
  }, [leftText, rightText]);

  const stats = useMemo(() => ({
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length,
  }), [diff]);

  const handleSample = () => {
    setLeftText(`function greet(name) {
  console.log("Hello " + name);
  return true;
}

const user = "John";
greet(user);`);
    setRightText(`function greet(name) {
  console.log(\`Hello \${name}!\`);
  return name;
}

const user = "Jane";
const result = greet(user);`);
  };

  const DiffOutput = () => (
    <div className="min-h-[380px] font-mono text-xs">
      {diff.length === 0 ? (
        <p className="text-muted-foreground text-sm">Enter text in both panels to see the diff…</p>
      ) : (
        diff.map((line, i) => (
          <div
            key={i}
            className={`flex items-start px-1 py-0.5 rounded-sm ${
              line.type === 'added' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : line.type === 'removed' ? 'bg-red-500/10 text-red-700 dark:text-red-300'
              : 'text-muted-foreground'
            }`}
          >
            <span className="w-8 shrink-0 text-right pr-3 opacity-40 select-none">{line.lineNum}</span>
            <span className="w-5 shrink-0 font-bold select-none">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
            </span>
            <span className="whitespace-pre-wrap break-all">{line.content || ' '}</span>
          </div>
        ))
      )}
    </div>
  );

  const faqs = [
    { question: "How does the diff work?", answer: "Text is compared line-by-line. Additions are highlighted green (+), deletions in red (−), unchanged lines in gray." },
    { question: "Is my data stored?", answer: "No. Comparisons happen entirely in your browser. Nothing is sent to any server." },
  ];

  return (
    <ToolLayout
      title="Diff Checker"
      description="Compare two text files or code snippets side by side. Spot changes instantly with line-by-line diff."
      category="dev"
      categoryLabel="Developer Tools"
      icon={GitCompare}
      faqs={faqs}
      relatedTools={[
        { title: "Code Beautifier", description: "Format HTML/CSS/JS", href: "/dev-tools/code-beautifier", icon: GitCompare, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: GitCompare, category: "dev" },
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: GitCompare, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs text-emerald-600 dark:text-emerald-400">
              +{stats.added} added
            </Badge>
            <Badge variant="secondary" className="text-xs text-red-600 dark:text-red-400">
              −{stats.removed} removed
            </Badge>
            <Badge variant="secondary" className="text-xs">{stats.unchanged} unchanged</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSample}>Sample</Button>
            <Button variant="outline" size="sm" onClick={() => { const t = leftText; setLeftText(rightText); setRightText(t); }} className="gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setLeftText(""); setRightText(""); }} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </div>

        {/* Input panels side by side */}
        <ResizableEditor
          left={{
            label: "Original",
            children: (
              <Textarea
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                placeholder="Paste original text here…"
                className="w-full h-full min-h-[380px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
                spellCheck={false}
              />
            ),
          }}
          right={{
            label: "Modified",
            children: (
              <Textarea
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                placeholder="Paste modified text here…"
                className="w-full h-full min-h-[380px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
                spellCheck={false}
              />
            ),
          }}
        />

        {/* Diff output */}
        {(leftText || rightText) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Diff Result</h3>
            <div className="rounded-xl border border-border bg-muted/20 overflow-auto max-h-[480px] p-3">
              <DiffOutput />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

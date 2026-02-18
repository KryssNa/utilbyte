"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GitCompare, RotateCcw, ArrowLeftRight } from "lucide-react";
import { useState, useMemo } from "react";

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  leftLineNum?: number;
  rightLineNum?: number;
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
      const leftLine = leftLines[i];
      const rightLine = rightLines[i];

      if (leftLine === undefined) {
        result.push({
          type: 'added',
          content: rightLine || '',
          rightLineNum: i + 1
        });
      } else if (rightLine === undefined) {
        result.push({
          type: 'removed',
          content: leftLine || '',
          leftLineNum: i + 1
        });
      } else if (leftLine === rightLine) {
        result.push({
          type: 'unchanged',
          content: leftLine,
          leftLineNum: i + 1,
          rightLineNum: i + 1
        });
      } else {
        result.push({
          type: 'removed',
          content: leftLine,
          leftLineNum: i + 1
        });
        result.push({
          type: 'added',
          content: rightLine,
          rightLineNum: i + 1
        });
      }
    }

    return result;
  }, [leftText, rightText]);

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    return { added, removed, unchanged };
  }, [diff]);

  const handleReset = () => {
    setLeftText("");
    setRightText("");
  };

  const handleSwap = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

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

  const faqs = [
    {
      question: "How does the diff comparison work?",
      answer: "The tool compares text line by line, highlighting additions in green and deletions in red. Unchanged lines are shown in gray.",
    },
    {
      question: "Can I compare code files?",
      answer: "Yes! Copy and paste code from any files to compare changes between different versions.",
    },
    {
      question: "Is my data stored anywhere?",
      answer: "No. All comparisons happen in your browser. Your text never leaves your device.",
    },
  ];

  return (
    <ToolLayout
      title="Diff Checker"
      description="Compare two text files or code snippets online. See differences side by side with highlighted changes."
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <span className="text-green-600 dark:text-green-400">+{stats.added}</span>
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="text-red-600 dark:text-red-400">-{stats.removed}</span>
            </Badge>
            <Badge variant="secondary">
              {stats.unchanged} unchanged
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSample}>
              Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleSwap} className="gap-2">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Swap
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Original Text</h3>
            <Textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="Paste original text here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Modified Text</h3>
            <Textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="Paste modified text here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        {diff.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Diff Result</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-auto">
                {diff.map((line, index) => (
                  <div
                    key={index}
                    className={`font-mono text-sm px-4 py-1 ${
                      line.type === 'added'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                        : line.type === 'removed'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                        : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    <span className="inline-block w-12 text-xs opacity-50 select-none">
                      {line.leftLineNum || line.rightLineNum || ''}
                    </span>
                    <span className="inline-block w-6 font-bold">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span>{line.content || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

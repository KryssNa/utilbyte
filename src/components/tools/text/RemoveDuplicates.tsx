"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Eye, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type RemoveMode = "lines" | "words";

export default function RemoveDuplicates() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [mode, setMode] = useState<RemoveMode>("lines");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showHighlights, setShowHighlights] = useState<boolean>(false);

  const stats = useMemo(() => {
    if (!outputText) return { original: 0, duplicates: 0, unique: 0 };

    const originalCount = mode === "lines"
      ? inputText.split("\n").filter(line => line.trim()).length
      : inputText.split(/\s+/).filter(word => word.trim()).length;

    const uniqueCount = mode === "lines"
      ? outputText.split("\n").filter(line => line.trim()).length
      : outputText.split(/\s+/).filter(word => word.trim()).length;

    return {
      original: originalCount,
      duplicates: originalCount - uniqueCount,
      unique: uniqueCount,
    };
  }, [inputText, outputText, mode]);

  const removeDuplicates = useCallback((text: string, mode: RemoveMode, caseSensitive: boolean): string => {
    if (!text.trim()) return text;

    if (mode === "lines") {
      const lines = text.split("\n");
      const seen = new Set<string>();
      const uniqueLines = lines.filter(line => {
        const key = caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return uniqueLines.join("\n");
    } else {
      const words = text.split(/\s+/);
      const seen = new Set<string>();
      const uniqueWords = words.filter(word => {
        if (!word.trim()) return true; // Keep empty strings for spacing
        const key = caseSensitive ? word : word.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return uniqueWords.join(" ");
    }
  }, []);

  const highlightDuplicates = useCallback((text: string, mode: RemoveMode, caseSensitive: boolean): string => {
    if (!text.trim()) return text;

    if (mode === "lines") {
      const lines = text.split("\n");
      const seen = new Set<string>();
      const highlightedLines = lines.map(line => {
        const key = caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) {
          return `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${line}</mark>`;
        }
        seen.add(key);
        return line;
      });
      return highlightedLines.join("\n");
    } else {
      const words = text.split(/(\s+)/);
      const seen = new Set<string>();
      const highlightedWords = words.map(word => {
        if (!word.trim()) return word; // Keep whitespace as-is
        const key = caseSensitive ? word : word.toLowerCase();
        if (seen.has(key)) {
          return `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${word}</mark>`;
        }
        seen.add(key);
        return word;
      });
      return highlightedWords.join("");
    }
  }, []);

  const handleRemove = useCallback(() => {
    const cleaned = removeDuplicates(inputText, mode, caseSensitive);
    setOutputText(cleaned);
    if (showHighlights) {
      const highlighted = highlightDuplicates(inputText, mode, caseSensitive);
      setHighlightedText(highlighted);
    }
  }, [inputText, mode, caseSensitive, removeDuplicates, highlightDuplicates, showHighlights]);

  const handleHighlightToggle = useCallback((enabled: boolean) => {
    setShowHighlights(enabled);
    if (enabled && inputText) {
      const highlighted = highlightDuplicates(inputText, mode, caseSensitive);
      setHighlightedText(highlighted);
    } else {
      setHighlightedText("");
    }
  }, [inputText, mode, caseSensitive, highlightDuplicates]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setHighlightedText("");
  };

  const faqs = [
    {
      question: "What does this tool do?",
      answer: "This tool removes duplicate lines or words from your text, keeping only the first occurrence of each unique item.",
    },
    {
      question: "What's the difference between removing duplicate lines vs words?",
      answer: "Remove duplicate lines compares entire lines of text. Remove duplicate words compares individual words separated by spaces.",
    },
    {
      question: "What does case sensitive mean?",
      answer: "When case sensitive is enabled, 'Word' and 'word' are treated as different. When disabled, they are considered duplicates.",
    },
  ];

  return (
    <ToolLayout
      title="Remove Duplicates"
      description="Remove duplicate lines or words from text. Clean up lists, remove repeated entries, and get statistics on duplicates found."
      category="text"
      categoryLabel="Text Tools"
      icon={Trash2}
      faqs={faqs}
      relatedTools={[
        { title: "Word Counter", description: "Count words and characters", href: "/text-tools/word-counter", icon: Trash2, category: "text" },
        { title: "Case Converter", description: "Change text case", href: "/text-tools/case-converter", icon: Trash2, category: "text" },
        { title: "Text Formatter", description: "Format text", href: "/text-tools/text-formatter", icon: Trash2, category: "text" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Input Text</h3>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text with duplicates..."
            className="min-h-[300px] text-base resize-none"
          />

          {/* Options */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Remove Mode</h4>
              <div className="flex gap-2">
                <Button
                  variant={mode === "lines" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("lines")}
                >
                  Remove Duplicate Lines
                </Button>
                <Button
                  variant={mode === "words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("words")}
                >
                  Remove Duplicate Words
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="case-sensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
              />
              <label
                htmlFor="case-sensitive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Case sensitive comparison
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="highlight-duplicates"
                checked={showHighlights}
                onCheckedChange={(checked) => handleHighlightToggle(checked as boolean)}
              />
              <label
                htmlFor="highlight-duplicates"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Highlight duplicates in input
              </label>
            </div>
          </div>

          <Button onClick={handleRemove} className="w-full" size="lg">
            Remove Duplicates
          </Button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          {/* Highlighted Input */}
          {showHighlights && highlightedText && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Input with Duplicates Highlighted
              </h3>
              <div
                className="min-h-[150px] p-4 border rounded-md bg-muted/30 text-base overflow-auto"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          )}

          {/* Cleaned Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Cleaned Text</h3>
              {outputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Cleaned text will appear here..."
              className="min-h-[200px] text-base resize-none bg-muted/30"
            />
          </div>

          {/* Statistics */}
          {outputText && (
            <div className="rounded-xl border bg-card p-4">
              <h4 className="text-sm font-medium mb-3">Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.original}</div>
                  <div className="text-xs text-muted-foreground">Original</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{stats.duplicates}</div>
                  <div className="text-xs text-muted-foreground">Duplicates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{stats.unique}</div>
                  <div className="text-xs text-muted-foreground">Unique</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

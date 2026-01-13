"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Hash, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function WordCounter() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = trimmedText ? trimmedText.split(/\n/).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    const speakingTime = Math.ceil(words / 150); // Average speaking speed

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    };
  }, [text]);

  const handleCopy = useCallback(async () => {
    const statsText = `Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Reading time: ${stats.readingTime} min
Speaking time: ${stats.speakingTime} min`;

    await navigator.clipboard.writeText(statsText);
    setCopied(true);
    toast.success("Stats copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [stats]);

  const handleReset = () => {
    setText("");
  };

  const faqs = [
    {
      question: "How is reading time calculated?",
      answer: "Reading time is estimated based on an average reading speed of 200 words per minute. Speaking time uses 150 words per minute.",
    },
    {
      question: "What counts as a word?",
      answer: "Words are counted by splitting text on whitespace. Hyphenated words count as one word.",
    },
    {
      question: "How are sentences counted?",
      answer: "Sentences are counted based on ending punctuation marks: periods, exclamation marks, and question marks.",
    },
  ];

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs instantly. Get reading and speaking time estimates."
      category="text"
      categoryLabel="Text Tools"
      icon={Hash}
      faqs={faqs}
      relatedTools={[
        { title: "Case Converter", description: "Change text case", href: "/text-tools/case-converter", icon: Hash, category: "text" },
        { title: "Remove Duplicates", description: "Remove duplicate lines", href: "/text-tools/remove-duplicates", icon: Hash, category: "text" },
        { title: "Text Formatter", description: "Format text", href: "/text-tools/text-formatter", icon: Hash, category: "text" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Enter your text</h3>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="min-h-[400px] text-base resize-none"
          />
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Statistics</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </Button>
          </div>

          <div className="space-y-3">
            {/* Primary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4 text-center">
                <div className="text-3xl font-bold text-primary">{stats.words}</div>
                <div className="text-xs text-muted-foreground mt-1">Words</div>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <div className="text-3xl font-bold text-primary">{stats.characters}</div>
                <div className="text-xs text-muted-foreground mt-1">Characters</div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="rounded-xl border bg-card divide-y">
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-muted-foreground">Characters (no spaces)</span>
                <span className="font-medium">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-muted-foreground">Sentences</span>
                <span className="font-medium">{stats.sentences}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-muted-foreground">Paragraphs</span>
                <span className="font-medium">{stats.paragraphs}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-muted-foreground">Lines</span>
                <span className="font-medium">{stats.lines}</span>
              </div>
            </div>

            {/* Time Estimates */}
            <div className="rounded-xl border bg-primary/5 p-4">
              <h4 className="text-sm font-medium mb-3">Time Estimates</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reading time</span>
                  <span className="font-medium">{stats.readingTime} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Speaking time</span>
                  <span className="font-medium">{stats.speakingTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

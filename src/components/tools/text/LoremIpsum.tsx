"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, FileText, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type OutputFormat = "paragraphs" | "sentences" | "words";
type HtmlFormat = "plain" | "p" | "div" | "span";

export default function LoremIpsum() {
  const [outputText, setOutputText] = useState<string>("");
  const [count, setCount] = useState<number>(3);
  const [format, setFormat] = useState<OutputFormat>("paragraphs");
  const [htmlFormat, setHtmlFormat] = useState<HtmlFormat>("plain");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Classic Lorem Ipsum text
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum"
  ];

  const generateLoremIpsum = useCallback((
    count: number,
    format: OutputFormat,
    htmlFormat: HtmlFormat,
    startWithLorem: boolean
  ): string => {
    let result = "";

    if (format === "words") {
      // Generate specified number of words
      const words: string[] = [];
      const startIndex = startWithLorem ? 0 : Math.floor(Math.random() * loremWords.length);

      for (let i = 0; i < count; i++) {
        const wordIndex = (startIndex + i) % loremWords.length;
        words.push(loremWords[wordIndex]);
      }

      result = words.join(" ");
      if (htmlFormat !== "plain") {
        result = wrapInHtml(result, htmlFormat);
      }

    } else if (format === "sentences") {
      // Generate specified number of sentences
      const sentences: string[] = [];

      for (let i = 0; i < count; i++) {
        // Each sentence has 8-15 words
        const sentenceLength = Math.floor(Math.random() * 8) + 8;
        const words: string[] = [];

        for (let j = 0; j < sentenceLength; j++) {
          const randomIndex = Math.floor(Math.random() * loremWords.length);
          words.push(loremWords[randomIndex]);
        }

        // Capitalize first word and add punctuation
        if (words.length > 0) {
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
          sentences.push(words.join(" ") + ".");
        }
      }

      result = sentences.join(" ");
      if (htmlFormat !== "plain") {
        result = wrapInHtml(result, htmlFormat);
      }

    } else {
      // Generate paragraphs
      const paragraphs: string[] = [];

      for (let p = 0; p < count; p++) {
        const sentences: string[] = [];
        // Each paragraph has 3-6 sentences
        const paragraphLength = Math.floor(Math.random() * 4) + 3;

        for (let s = 0; s < paragraphLength; s++) {
          // Each sentence has 8-15 words
          const sentenceLength = Math.floor(Math.random() * 8) + 8;
          const words: string[] = [];

          for (let w = 0; w < sentenceLength; w++) {
            const randomIndex = Math.floor(Math.random() * loremWords.length);
            words.push(loremWords[randomIndex]);
          }

          // Capitalize first word and add punctuation
          if (words.length > 0) {
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            sentences.push(words.join(" ") + ".");
          }
        }

        paragraphs.push(sentences.join(" "));
      }

      if (htmlFormat === "plain") {
        result = paragraphs.join("\n\n");
      } else {
        result = paragraphs.map(p => wrapInHtml(p, htmlFormat)).join("\n\n");
      }
    }

    return result;
  }, []);

  const wrapInHtml = (text: string, format: HtmlFormat): string => {
    switch (format) {
      case "p":
        return `<p>${text}</p>`;
      case "div":
        return `<div>${text}</div>`;
      case "span":
        return `<span>${text}</span>`;
      default:
        return text;
    }
  };

  const handleGenerate = useCallback(() => {
    const generated = generateLoremIpsum(count, format, htmlFormat, startWithLorem);
    setOutputText(generated);
  }, [count, format, htmlFormat, startWithLorem, generateLoremIpsum]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Lorem Ipsum text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleReset = () => {
    setOutputText("");
  };

  const formatOptions = [
    { value: "paragraphs", label: "Paragraphs", description: "Generate multiple paragraphs" },
    { value: "sentences", label: "Sentences", description: "Generate multiple sentences" },
    { value: "words", label: "Words", description: "Generate specific number of words" },
  ];

  const htmlOptions = [
    { value: "plain", label: "Plain Text", description: "No HTML tags" },
    { value: "p", label: "Paragraphs", description: "Wrap in <p> tags" },
    { value: "div", label: "Divs", description: "Wrap in <div> tags" },
    { value: "span", label: "Spans", description: "Wrap in <span> tags" },
  ];

  const faqs = [
    {
      question: "What is Lorem Ipsum?",
      answer: "Lorem Ipsum is dummy text used as placeholder content in design and publishing. It helps visualize layouts without using meaningful content.",
    },
    {
      question: "Why use Lorem Ipsum instead of real text?",
      answer: "It allows designers and developers to focus on visual design without being distracted by the meaning of the content.",
    },
    {
      question: "Can I customize the output?",
      answer: "Yes! You can choose the number of paragraphs, sentences, or words, and wrap the output in HTML tags if needed.",
    },
  ];

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your designs and layouts. Customize paragraphs, sentences, or word count with optional HTML formatting."
      category="text"
      categoryLabel="Text Tools"
      icon={FileText}
      faqs={faqs}
      relatedTools={[
        { title: "Word Counter", description: "Count words and characters", href: "/text-tools/word-counter", icon: FileText, category: "text" },
        { title: "Case Converter", description: "Change text case", href: "/text-tools/case-converter", icon: FileText, category: "text" },
        { title: "Text Formatter", description: "Format text", href: "/text-tools/text-formatter", icon: FileText, category: "text" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Generator Settings</h3>

            {/* Count Input */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
              />
            </div>

            {/* Format Selection */}
            <div className="space-y-3 mb-4">
              <Label>Output Format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* HTML Format */}
            <div className="space-y-3 mb-4">
              <Label>HTML Format</Label>
              <Select value={htmlFormat} onValueChange={(value) => setHtmlFormat(value as HtmlFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {htmlOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start with Lorem Switch */}
            <div className="flex items-center space-x-2 mb-6">
              <Switch
                id="start-lorem"
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
              />
              <Label htmlFor="start-lorem">Start with "Lorem ipsum dolor sit amet"</Label>
            </div>

            <Button onClick={handleGenerate} className="w-full" size="lg">
              Generate Lorem Ipsum
            </Button>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Generated Text</h3>
            <div className="flex gap-2">
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
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={outputText}
            readOnly
            placeholder="Your Lorem Ipsum text will appear here..."
            className="min-h-[400px] text-base resize-none"
          />

          {outputText && (
            <div className="text-sm text-muted-foreground">
              {format === "words"
                ? `${count} words generated`
                : format === "sentences"
                  ? `Approximately ${count} sentences generated`
                  : `${count} paragraphs generated`
              }
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

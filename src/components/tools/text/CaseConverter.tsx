"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, RotateCcw, Type } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type CaseType =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase";

export default function CaseConverter() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("uppercase");
  const [copied, setCopied] = useState<boolean>(false);

  const convertCase = useCallback((text: string, caseType: CaseType): string => {
    if (!text.trim()) return text;

    switch (caseType) {
      case "uppercase":
        return text.toUpperCase();

      case "lowercase":
        return text.toLowerCase();

      case "titlecase":
        return text.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );

      case "sentencecase":
        return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

      case "camelcase":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

      case "pascalcase":
        return text
          .toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());

      case "snakecase":
        return text
          .replace(/([a-z])([A-Z])/g, "$1_$2")
          .replace(/[\s-]/g, "_")
          .toLowerCase();

      case "kebabcase":
        return text
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]/g, "-")
          .toLowerCase();

      default:
        return text;
    }
  }, []);

  const handleConvert = useCallback(() => {
    if (inputText.trim()) {
      const converted = convertCase(inputText, selectedCase);
      setOutputText(converted);
    }
  }, [inputText, selectedCase, convertCase]);

  // Auto-convert when input text changes
  useMemo(() => {
    if (inputText.trim()) {
      const converted = convertCase(inputText, selectedCase);
      setOutputText(converted);
    } else {
      setOutputText("");
    }
  }, [inputText, selectedCase, convertCase]);

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
  };

  const caseOptions = [
    { value: "uppercase", label: "UPPERCASE", description: "Convert to all uppercase" },
    { value: "lowercase", label: "lowercase", description: "Convert to all lowercase" },
    { value: "titlecase", label: "Title Case", description: "Capitalize first letter of each word" },
    { value: "sentencecase", label: "Sentence case", description: "Capitalize first letter of each sentence" },
    { value: "camelcase", label: "camelCase", description: "camelCase (JavaScript style)" },
    { value: "pascalcase", label: "PascalCase", description: "PascalCase (C# style)" },
    { value: "snakecase", label: "snake_case", description: "snake_case (Python style)" },
    { value: "kebabcase", label: "kebab-case", description: "kebab-case (CSS style)" },
  ];

  const faqs = [
    {
      question: "What is case conversion?",
      answer: "Case conversion changes the capitalization of text. Different programming languages and styles use different case conventions.",
    },
    {
      question: "When should I use different cases?",
      answer: "Use UPPERCASE for constants, camelCase for JavaScript variables, PascalCase for C# classes, snake_case for Python, and kebab-case for CSS classes.",
    },
    {
      question: "Does it preserve special characters?",
      answer: "Yes, special characters, numbers, and punctuation are preserved. Only letter casing is changed.",
    },
  ];

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between different case styles: uppercase, lowercase, title case, camelCase, PascalCase, snake_case, and more."
      category="text"
      categoryLabel="Text Tools"
      icon={Type}
      faqs={faqs}
      relatedTools={[
        { title: "Word Counter", description: "Count words and characters", href: "/text-tools/word-counter", icon: Type, category: "text" },
        { title: "Remove Duplicates", description: "Remove duplicate lines", href: "/text-tools/remove-duplicates", icon: Type, category: "text" },
        { title: "Text Formatter", description: "Format text", href: "/text-tools/text-formatter", icon: Type, category: "text" },
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
            placeholder="Enter text to convert..."
            className="min-h-[300px] text-base resize-none"
          />

          {/* Case Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Select Case Style</h4>
            <div className="grid grid-cols-2 gap-2">
              {caseOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedCase === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newCase = option.value as CaseType;
                    setSelectedCase(newCase);
                    if (inputText.trim()) {
                      const converted = convertCase(inputText, newCase);
                      setOutputText(converted);
                    }
                  }}
                  className="justify-start h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-xs">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleConvert} className="w-full" size="lg">
            Convert to {caseOptions.find(opt => opt.value === selectedCase)?.label}
          </Button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Converted Text</h3>
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
            placeholder="Converted text will appear here..."
            className="min-h-[300px] text-base resize-none bg-muted/30"
          />

          {outputText && (
            <div className="text-sm text-muted-foreground">
              {outputText.length} characters converted to{" "}
              {caseOptions.find(opt => opt.value === selectedCase)?.label.toLowerCase()}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

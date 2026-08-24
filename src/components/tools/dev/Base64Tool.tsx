"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Binary, Check, Copy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<Mode>("encode");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    if (!input.trim()) return "";

    try {
      if (mode === "encode") {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch (error) {
      return "Invalid Base64 string";
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (!result || result === "Invalid Base64 string") return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Result copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleSample = () => {
    if (mode === "encode") {
      setInput("Hello, World!");
    } else {
      setInput("SGVsbG8sIFdvcmxkIQ==");
    }
  };

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput("");
  };

  const isValidInput = useMemo(() => {
    if (!input.trim()) return true;
    if (mode === "decode") {
      try {
        atob(input);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }, [input, mode]);

  const faqs = [
    {
      question: "What is Base64 encoding?",
      answer: "Base64 is a binary-to-text encoding scheme that converts binary data into a text format using 64 different characters (A-Z, a-z, 0-9, +, /).",
    },
    {
      question: "When should I use Base64?",
      answer: "Base64 is commonly used for encoding binary data in text-based formats like JSON, XML, or email. It's also used for embedding images in HTML/CSS.",
    },
    {
      question: "Is Base64 encryption?",
      answer: "No, Base64 is not encryption. It's a reversible encoding scheme that anyone can decode. It doesn't provide security.",
    },
  ];

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 back to text. Perfect for developers working with APIs, data transmission, and encoding."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Binary}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format and validate JSON", href: "/dev-tools/json-formatter", icon: Binary, category: "dev" },
        { title: "UUID Generator", description: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: Binary, category: "dev" },
        { title: "URL Encoder", description: "Encode/decode URLs", href: "/dev-tools/url-encoder", icon: Binary, category: "dev" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex rounded-lg border bg-card p-1">
            <Button
              variant={mode === "encode" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("encode")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Encode
            </Button>
            <Button
              variant={mode === "decode" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("decode")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Decode
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
              </h3>
              <Button variant="outline" size="sm" onClick={handleSample}>
                Sample
              </Button>
            </div>

            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 string to decode..."
              }
              className="min-h-[300px] font-mono text-sm"
            />

            {/* Input Validation */}
            {input.trim() && !isValidInput && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                Invalid Base64 string
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!result || result === "Invalid Base64 string"}
                className="gap-2"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </Button>
            </div>

            <Textarea
              value={result}
              readOnly
              placeholder="Result will appear here..."
              className={`min-h-[300px] font-mono text-sm ${result === "Invalid Base64 string" ? "text-red-600" : "bg-muted/30"
                }`}
            />
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg bg-muted/50 p-6">
          <h4 className="font-semibold mb-2">About Base64</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Base64</strong> uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data in text format.
              Each character represents 6 bits of data.
            </p>
            <p>
              <strong>Encoding:</strong> Converts binary data to text. Output is ~33% larger than input.
            </p>
            <p>
              <strong>Common uses:</strong> Email attachments, embedding images in HTML/CSS, API data transmission, JWT tokens.
            </p>
            <p>
              <strong>Padding:</strong> Uses = characters for padding when input length isn't divisible by 3.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

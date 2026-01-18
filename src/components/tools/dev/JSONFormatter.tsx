"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Braces, Check, CheckCircle, Copy, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function JSONFormatter() {
  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const { formatted, error, isValid } = useMemo(() => {
    if (!input.trim()) {
      return { formatted: "", error: null, isValid: true };
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      return { formatted, error: null, isValid: true };
    } catch (err) {
      return {
        formatted: "",
        error: err instanceof Error ? err.message : "Invalid JSON",
        isValid: false
      };
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast.success("Formatted JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const handleReset = () => {
    setInput("");
  };

  const handleSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345"
      },
      hobbies: ["reading", "coding", "gaming"],
      active: true
    };
    setInput(JSON.stringify(sample));
  };

  const faqs = [
    {
      question: "What is JSON formatting?",
      answer: "JSON formatting makes your JSON data more readable by adding proper indentation, line breaks, and consistent spacing.",
    },
    {
      question: "Does this tool validate JSON?",
      answer: "Yes! The tool validates your JSON syntax and shows error messages if the JSON is invalid.",
    },
    {
      question: "Is my data stored or sent anywhere?",
      answer: "No. All JSON processing happens in your browser. Your data never leaves your device.",
    },
  ];

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format and validate JSON online. Pretty print JSON with proper indentation and syntax highlighting."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Braces}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode Base64", href: "/dev-tools/base64", icon: Braces, category: "dev" },
        { title: "UUID Generator", description: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: Braces, category: "dev" },
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: Braces, category: "dev" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Input JSON</h3>
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
            placeholder="Paste your JSON here..."
            className="min-h-[400px] font-mono text-sm"
          />

          {/* Status Indicator */}
          {input.trim() && (
            <div className={`flex items-center gap-2 text-sm ${isValid ? "text-green-600" : "text-red-600"}`}>
              {isValid ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Valid JSON
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </>
              )}
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Formatted JSON</h3>
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
              placeholder="Formatted JSON will appear here..."
              className="min-h-[400px] font-mono text-sm bg-muted/30"
            />
          </div>

          {formatted && (
            <div className="text-xs text-muted-foreground text-center">
              JSON formatted with 2-space indentation
            </div>
          )}
        </div>
      </div>

      <ContentCluster
        category="dev"
        title="Complete Developer Tools Suite"
        description="Essential tools for developers: format code, validate data, encode/decode, and debug applications. Everything you need for efficient development."
        mainTool={{
          title: "Advanced JSON Formatter",
          href: "/dev-tools/json-formatter",
          description: "Format, validate, and beautify JSON data with syntax highlighting. Essential for API development and debugging."
        }}
        topics={[
          {
            title: "Base64 Encoder/Decoder",
            description: "Encode and decode Base64 strings for data transmission and storage",
            href: "/dev-tools/base64",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "UUID Generator",
            description: "Generate RFC 4122 compliant unique identifiers for databases and APIs",
            href: "/dev-tools/uuid-generator",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "JWT Decoder",
            description: "Decode and inspect JSON Web Tokens for authentication debugging",
            href: "/dev-tools/jwt-decoder",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "Hash Generator",
            description: "Generate MD5, SHA-256, SHA-512 hashes for security and integrity",
            href: "/dev-tools/hash-generator",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "Regex Tester",
            description: "Test and debug regular expressions with live matching and capture groups",
            href: "/dev-tools/regex-tester",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "URL Encoder/Decoder",
            description: "Encode and decode URLs, URIs, and query strings for web development",
            href: "/dev-tools/url-encoder",
            type: "tool",
            category: "Developer Tools"
          }
        ]}
      />
    </ToolLayout>
  );
}

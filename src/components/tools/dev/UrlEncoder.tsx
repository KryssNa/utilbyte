"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Copy, FileText, Link, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type EncodeType = "url" | "urlComponent" | "formData" | "base64";

export default function UrlEncoder() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [encodeType, setEncodeType] = useState<EncodeType>("url");
  const [isEncoding, setIsEncoding] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const encodeText = useCallback((text: string, type: EncodeType): string => {
    if (!text) return "";

    try {
      switch (type) {
        case "url":
          return isEncoding ? encodeURI(text) : decodeURI(text);
        case "urlComponent":
          return isEncoding ? encodeURIComponent(text) : decodeURIComponent(text);
        case "formData":
          if (isEncoding) {
            // Simple form data encoding
            return text.split('&').map(pair => {
              const [key, ...valueParts] = pair.split('=');
              const value = valueParts.join('=');
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }).join('&');
          } else {
            // Simple form data decoding
            return text.split('&').map(pair => {
              const [key, value] = pair.split('=');
              return `${decodeURIComponent(key)}=${decodeURIComponent(value)}`;
            }).join('&');
          }
        case "base64":
          if (isEncoding) {
            return btoa(text);
          } else {
            return atob(text);
          }
        default:
          return text;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encoding/decoding error");
      return text;
    }
  }, [isEncoding]);

  const handleProcess = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    const result = encodeText(inputText, encodeType);
    setOutputText(result);
    setError("");
  }, [inputText, encodeType, encodeText]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const loadExample = (example: string) => {
    setInputText(example);
  };

  const examples = {
    url: [
      "https://example.com/path with spaces/page.html?query=value&other=test",
      "Hello World! How are you?",
      "user@example.com",
    ],
    urlComponent: [
      "Hello World! How are you?",
      "user@example.com",
      "name=John Doe&age=30&city=New York",
    ],
    formData: [
      "name=John Doe&email=user@example.com&message=Hello World!",
      "username=test&password=secret123&remember=true",
    ],
    base64: [
      "Hello, World!",
      "user@example.com",
      "Sensitive data here",
    ],
  };

  const getCurrentExamples = () => examples[encodeType];

  const faqs = [
    {
      question: "What's the difference between URL encoding and URL component encoding?",
      answer: "encodeURI() encodes characters that have special meaning in URLs but leaves characters like :, /, ?, # intact. encodeURIComponent() encodes all characters that could be problematic.",
    },
    {
      question: "When should I use Base64 encoding?",
      answer: "Base64 is useful for encoding binary data or when you need to transmit data that might contain special characters through text-only channels.",
    },
    {
      question: "What is form data encoding?",
      answer: "Form data encoding properly encodes key-value pairs for URL query strings or form submissions, handling special characters in both keys and values.",
    },
  ];

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode and decode URLs, URL components, form data, and Base64 strings. Perfect for web development and API testing."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Link}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode base64", href: "/dev-tools/base64", icon: Link, category: "dev" },
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: Link, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Link, category: "dev" },
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
            placeholder="Enter text to encode/decode..."
            className="min-h-[200px] text-base"
          />

          {/* Encoding Type */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Encoding Type</h4>
            <Select value={encodeType} onValueChange={(value) => setEncodeType(value as EncodeType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL (encodeURI/decodeURI)</SelectItem>
                <SelectItem value="urlComponent">URL Component (encodeURIComponent/decodeURIComponent)</SelectItem>
                <SelectItem value="formData">Form Data</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={isEncoding ? "default" : "outline"}
              onClick={() => setIsEncoding(true)}
              className="flex-1"
            >
              Encode
            </Button>
            <Button
              variant={!isEncoding ? "default" : "outline"}
              onClick={() => setIsEncoding(false)}
              className="flex-1"
            >
              Decode
            </Button>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examples
            </h4>
            <div className="space-y-2">
              {getCurrentExamples().map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example)}
                  className="w-full text-left justify-start h-auto p-3"
                >
                  <div className="truncate text-xs font-mono">
                    {example.length > 60 ? `${example.substring(0, 60)}...` : example}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleProcess} className="w-full" size="lg">
            {isEncoding ? "Encode" : "Decode"} {encodeType.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </Button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Output</h3>
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

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Textarea
            value={outputText}
            readOnly
            placeholder="Processed text will appear here..."
            className="min-h-[200px] text-base font-mono bg-muted/30"
          />

          {/* Stats */}
          {outputText && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Input: {inputText.length} chars</Badge>
              <Badge variant="secondary">Output: {outputText.length} chars</Badge>
              <Badge variant="secondary">
                Change: {outputText.length - inputText.length > 0 ? '+' : ''}{outputText.length - inputText.length}
              </Badge>
            </div>
          )}

          {/* Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <div>
              <strong>URL Encoding:</strong> Encodes characters that have special meaning in URLs
            </div>
            <div>
              <strong>URL Component:</strong> Encodes all special characters for use in URL components
            </div>
            <div>
              <strong>Form Data:</strong> Properly encodes key-value pairs for forms and query strings
            </div>
            <div>
              <strong>Base64:</strong> Converts binary data to text representation
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

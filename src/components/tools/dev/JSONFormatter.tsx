"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import ResizableEditor from "./ResizableEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Braces, Check, CheckCircle, Copy, RotateCcw, Minimize2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function JSONFormatter() {
  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [indentSize, setIndentSize] = useState<number>(2);

  const { formatted, error, isValid, stats } = useMemo(() => {
    if (!input.trim()) {
      return { formatted: "", error: null, isValid: true, stats: { keys: 0, depth: 0, size: 0 } };
    }

    try {
      const parsed = JSON.parse(input);
      const fmt = JSON.stringify(parsed, null, indentSize);

      const calculateDepth = (obj: any, d = 0): number => {
        if (typeof obj !== 'object' || obj === null) return d;
        return Math.max(d, ...Object.values(obj).map(val => calculateDepth(val, d + 1)));
      };

      const countKeys = (obj: any): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        return Object.keys(obj).length + Object.values(obj).reduce((sum: number, val) => sum + countKeys(val), 0);
      };

      return {
        formatted: fmt,
        error: null,
        isValid: true,
        stats: { keys: countKeys(parsed), depth: calculateDepth(parsed), size: fmt.length },
      };
    } catch (err) {
      return {
        formatted: "",
        error: err instanceof Error ? err.message : "Invalid JSON",
        isValid: false,
        stats: { keys: 0, depth: 0, size: 0 },
      };
    }
  }, [input, indentSize]);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast.success("Formatted JSON copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const handleReset = () => setInput("");

  const handleSample = () => {
    setInput(JSON.stringify({
      name: "John Doe", age: 30, email: "john@example.com",
      address: { street: "123 Main St", city: "Anytown", zipCode: "12345" },
      hobbies: ["reading", "coding", "gaming"], active: true,
    }));
  };

  const handleMinify = () => {
    if (!formatted) return;
    try {
      setInput(JSON.stringify(JSON.parse(formatted)));
      toast.success("JSON minified!");
    } catch {
      toast.error("Cannot minify invalid JSON");
    }
  };

  const faqs = [
    { question: "What is JSON formatting?", answer: "JSON formatting makes your JSON data more readable by adding proper indentation, line breaks, and consistent spacing." },
    { question: "Does this tool validate JSON?", answer: "Yes! The tool validates your JSON syntax and shows error messages if the JSON is invalid." },
    { question: "Is my data stored or sent anywhere?", answer: "No. All JSON processing happens in your browser. Your data never leaves your device." },
  ];

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate and minify JSON online. Pretty print with syntax checking — all in your browser."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Braces}
      faqs={faqs}
      relatedTools={[
        { title: "Base64", description: "Encode/decode Base64", href: "/dev-tools/base64", icon: Braces, category: "dev" },
        { title: "UUID Generator", description: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: Braces, category: "dev" },
        { title: "Diff Checker", description: "Compare text & code", href: "/dev-tools/diff-checker", icon: Braces, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        {/* Top controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={indentSize.toString()} onValueChange={(v) => setIndentSize(Number(v))}>
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="8">Tab</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleSample}>Sample</Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Clear
          </Button>

          {input.trim() && (
            <div className={`ml-auto flex items-center gap-1.5 text-xs ${isValid ? "text-emerald-500" : "text-red-500"}`}>
              {isValid ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              <span className="font-medium">{isValid ? "Valid JSON" : error}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {isValid && stats.keys > 0 && (
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">{stats.keys} keys</Badge>
            <Badge variant="secondary" className="text-xs">{stats.depth} levels deep</Badge>
            <Badge variant="secondary" className="text-xs">{stats.size} bytes</Badge>
          </div>
        )}

        {/* Resizable split editor */}
        <ResizableEditor
          left={{
            label: "Input JSON",
            actions: (
              <>
                <Button variant="ghost" size="sm" onClick={handleMinify} disabled={!formatted} className="h-6 px-2 text-xs gap-1">
                  <Minimize2 className="h-3 w-3" /> Minify
                </Button>
              </>
            ),
            children: (
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here…"
                className="w-full h-full min-h-[360px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
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
                placeholder="Formatted JSON will appear here…"
                className="w-full h-full min-h-[360px] font-mono text-sm border-0 bg-transparent resize-none focus-visible:ring-0 p-0"
                spellCheck={false}
              />
            ),
          }}
        />
      </div>

      <ContentCluster
        category="dev"
        title="Complete Developer Tools Suite"
        description="Essential tools for developers: format code, validate data, encode/decode, and debug applications."
        mainTool={{ title: "JSON Formatter", href: "/dev-tools/json-formatter", description: "Format, validate, and beautify JSON data with syntax checking." }}
        topics={[
          { title: "Base64 Encoder/Decoder", description: "Encode and decode Base64 strings", href: "/dev-tools/base64", type: "tool", category: "Developer Tools" },
          { title: "UUID Generator", description: "Generate RFC 4122 compliant unique identifiers", href: "/dev-tools/uuid-generator", type: "tool", category: "Developer Tools" },
          { title: "JWT Decoder", description: "Decode and inspect JSON Web Tokens", href: "/dev-tools/jwt-decoder", type: "tool", category: "Developer Tools" },
          { title: "Hash Generator", description: "Generate MD5, SHA-256, SHA-512 hashes", href: "/dev-tools/hash-generator", type: "tool", category: "Developer Tools" },
          { title: "Diff Checker", description: "Compare two text snippets or code files", href: "/dev-tools/diff-checker", type: "tool", category: "Developer Tools" },
          { title: "Regex Tester", description: "Test and debug regular expressions live", href: "/dev-tools/regex-tester", type: "tool", category: "Developer Tools" },
        ]}
      />
    </ToolLayout>
  );
}

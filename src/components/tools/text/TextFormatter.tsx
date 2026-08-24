"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, CheckCircle, Copy, FileText, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type FormatType = "json" | "xml" | "sql" | "css" | "javascript" | "typescript";

export default function TextFormatter() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [formatType, setFormatType] = useState<FormatType>("json");
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const formatText = useCallback((text: string, type: FormatType): { formatted: string; error?: string; } => {
    if (!text.trim()) return { formatted: text };

    try {
      switch (type) {
        case "json":
          // Try to parse and format JSON
          const parsed = JSON.parse(text);
          return { formatted: JSON.stringify(parsed, null, 2) };

        case "xml":
          // Basic XML formatting (remove extra whitespace, add indentation)
          return { formatted: formatXML(text) };

        case "sql":
          // Basic SQL formatting (uppercase keywords, proper spacing)
          return { formatted: formatSQL(text) };

        case "css":
          // Basic CSS formatting
          return { formatted: formatCSS(text) };

        case "javascript":
        case "typescript":
          // Basic JavaScript/TypeScript formatting (this is very basic - a real formatter would use prettier)
          return { formatted: formatJavaScript(text) };

        default:
          return { formatted: text };
      }
    } catch (err) {
      return {
        formatted: text,
        error: `Invalid ${type.toUpperCase()}: ${err instanceof Error ? err.message : 'Unknown error'}`
      };
    }
  }, []);

  const formatXML = (xml: string): string => {
    // Very basic XML formatting - in a real app you'd use a proper XML parser
    let formatted = xml;
    // Remove extra whitespace between tags
    formatted = formatted.replace(/>\s+</g, '><');
    // Add line breaks before opening tags
    formatted = formatted.replace(/</g, '\n<');
    // Basic indentation (very simplistic)
    let indent = 0;
    const lines = formatted.split('\n');
    const result = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }

      const indented = '  '.repeat(indent) + trimmed;

      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent++;
      }

      return indented;
    });

    return result.join('\n').trim();
  };

  const formatSQL = (sql: string): string => {
    // Basic SQL formatting
    let formatted = sql;

    // Uppercase common SQL keywords
    const keywords = ['select', 'from', 'where', 'join', 'inner', 'left', 'right', 'outer', 'on', 'group', 'by', 'having', 'order', 'limit', 'insert', 'update', 'delete', 'create', 'alter', 'drop', 'table', 'index', 'view'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword.toUpperCase());
    });

    // Add line breaks after certain keywords
    formatted = formatted.replace(/(\bSELECT\b|\bFROM\b|\bWHERE\b|\bJOIN\b|\bGROUP BY\b|\bORDER BY\b|\bHAVING\b)/gi, '$1\n  ');
    formatted = formatted.replace(/(\bINSERT INTO\b|\bUPDATE\b|\bDELETE FROM\b)/gi, '$1\n  ');

    // Clean up multiple spaces
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/\s*\n\s*/g, '\n');

    return formatted.trim();
  };

  const formatCSS = (css: string): string => {
    // Basic CSS formatting
    let formatted = css;

    // Add line breaks after opening braces and before closing braces
    formatted = formatted.replace(/\{/g, ' {\n  ');
    formatted = formatted.replace(/;/g, ';\n  ');
    formatted = formatted.replace(/\}/g, '\n}\n\n');

    // Clean up extra whitespace
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');

    return formatted.trim();
  };

  const formatJavaScript = (code: string): string => {
    // Very basic JavaScript formatting - real formatting would use prettier or similar
    let formatted = code;

    // Add line breaks after semicolons (except in strings)
    formatted = formatted.replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, ';\n');

    // Add line breaks after opening braces
    formatted = formatted.replace(/\{(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, ' {\n  ');

    // Add line breaks before closing braces
    formatted = formatted.replace(/\}(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, '\n}');

    // Basic indentation (very simplistic)
    let indent = 0;
    const lines = formatted.split('\n');
    const result = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('}')) {
        indent = Math.max(0, indent - 1);
      }

      const indented = '  '.repeat(indent) + trimmed;

      if (trimmed.endsWith('{')) {
        indent++;
      }

      return indented;
    });

    return result.join('\n').trim();
  };

  const handleFormat = useCallback(() => {
    const result = formatText(inputText, formatType);
    setOutputText(result.formatted);
    setError(result.error || "");
    setSuccess(!result.error);
  }, [inputText, formatType, formatText]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Formatted text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError("");
    setSuccess(false);
  };

  const formatOptions = [
    { value: "json", label: "JSON", description: "JavaScript Object Notation" },
    { value: "xml", label: "XML", description: "Extensible Markup Language" },
    { value: "sql", label: "SQL", description: "Structured Query Language" },
    { value: "css", label: "CSS", description: "Cascading Style Sheets" },
    { value: "javascript", label: "JavaScript", description: "JavaScript code" },
    { value: "typescript", label: "TypeScript", description: "TypeScript code" },
  ];

  const faqs = [
    {
      question: "What formats does this tool support?",
      answer: "This tool can format JSON, XML, SQL, CSS, JavaScript, and TypeScript code with proper indentation and structure.",
    },
    {
      question: "Does it validate the input?",
      answer: "Yes, the tool validates JSON and will show errors for invalid syntax. Other formats use basic formatting rules.",
    },
    {
      question: "Can I format minified code?",
      answer: "Yes, this tool is perfect for beautifying minified or compressed code to make it more readable.",
    },
  ];

  return (
    <ToolLayout
      title="Text Formatter"
      description="Format and beautify code in multiple languages. Supports JSON, XML, SQL, CSS, JavaScript, and TypeScript formatting."
      category="text"
      categoryLabel="Text Tools"
      icon={FileText}
      faqs={faqs}
      relatedTools={[
        { title: "Word Counter", description: "Count words and characters", href: "/text-tools/word-counter", icon: FileText, category: "text" },
        { title: "Case Converter", description: "Change text case", href: "/text-tools/case-converter", icon: FileText, category: "text" },
        { title: "Remove Duplicates", description: "Remove duplicate lines", href: "/text-tools/remove-duplicates", icon: FileText, category: "text" },
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
            placeholder="Paste your code here..."
            className="min-h-[300px] text-base resize-none font-mono"
          />

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Select Format</h4>
            <Select value={formatType} onValueChange={(value) => setFormatType(value as FormatType)}>
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

          <Button onClick={handleFormat} className="w-full" size="lg">
            Format {formatOptions.find(opt => opt.value === formatType)?.label}
          </Button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Formatted Text</h3>
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

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !error && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Successfully formatted!</AlertDescription>
            </Alert>
          )}

          <Textarea
            value={outputText}
            readOnly
            placeholder="Formatted text will appear here..."
            className="min-h-[300px] text-base resize-none bg-muted/30 font-mono"
          />

          {outputText && (
            <div className="text-sm text-muted-foreground">
              {outputText.length} characters • {outputText.split('\n').length} lines
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

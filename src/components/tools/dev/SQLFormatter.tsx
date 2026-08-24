"use client";

import ContentCluster from "@/components/shared/ContentCluster";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Database, Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function SQLFormatter() {
  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return "";

    let formatted = sql
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ",\n  ")
      .replace(/\bSELECT\b/gi, "SELECT\n  ")
      .replace(/\bFROM\b/gi, "\nFROM\n  ")
      .replace(/\bWHERE\b/gi, "\nWHERE\n  ")
      .replace(/\bAND\b/gi, "\n  AND ")
      .replace(/\bOR\b/gi, "\n  OR ")
      .replace(/\bJOIN\b/gi, "\nJOIN\n  ")
      .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN\n  ")
      .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN\n  ")
      .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN\n  ")
      .replace(/\bON\b/gi, "\n  ON ")
      .replace(/\bORDER BY\b/gi, "\nORDER BY\n  ")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY\n  ")
      .replace(/\bHAVING\b/gi, "\nHAVING\n  ")
      .replace(/\bLIMIT\b/gi, "\nLIMIT ")
      .replace(/\bINSERT INTO\b/gi, "INSERT INTO ")
      .replace(/\bVALUES\b/gi, "\nVALUES\n  ")
      .replace(/\bUPDATE\b/gi, "UPDATE ")
      .replace(/\bSET\b/gi, "\nSET\n  ")
      .replace(/\bDELETE FROM\b/gi, "DELETE FROM ")
      .replace(/\bCREATE TABLE\b/gi, "CREATE TABLE ")
      .replace(/\bALTER TABLE\b/gi, "ALTER TABLE ")
      .replace(/\bDROP TABLE\b/gi, "DROP TABLE ")
      .trim();

    return formatted;
  };

  const formatted = formatSQL(input);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast.success("Formatted SQL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const handleReset = () => {
    setInput("");
  };

  const handleSample = () => {
    const sample = "SELECT users.id, users.name, orders.total FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.active = 1 AND orders.total > 100 ORDER BY orders.total DESC LIMIT 10;";
    setInput(sample);
  };

  const faqs = [
    {
      question: "What SQL dialects are supported?",
      answer: "The formatter works with standard SQL syntax and is compatible with MySQL, PostgreSQL, SQLite, and most SQL databases.",
    },
    {
      question: "Does this validate SQL syntax?",
      answer: "No, this tool focuses on formatting. It will format any text following SQL patterns, but won't validate syntax errors.",
    },
    {
      question: "Is my SQL query stored anywhere?",
      answer: "No. All SQL formatting happens in your browser. Your queries never leave your device.",
    },
  ];

  return (
    <ToolLayout
      title="SQL Formatter"
      description="Format and beautify SQL queries online. Make your SQL code readable with proper indentation and line breaks."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Database}
      faqs={faqs}
      relatedTools={[
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Database, category: "dev" },
        { title: "Code Beautifier", description: "Format HTML/CSS/JS", href: "/dev-tools/code-beautifier", icon: Database, category: "dev" },
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: Database, category: "dev" },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Input SQL</h3>
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
            placeholder="Paste your SQL query here..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Formatted SQL</h3>
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
              placeholder="Formatted SQL will appear here..."
              className="min-h-[400px] font-mono text-sm bg-muted/30"
            />
          </div>

          {formatted && (
            <div className="text-xs text-muted-foreground text-center">
              SQL formatted with proper indentation
            </div>
          )}
        </div>
      </div>

      <ContentCluster
        category="dev"
        title="Complete SQL Development Tools"
        description="Essential SQL tools for database development: format queries, test patterns, and debug database operations."
        mainTool={{
          title: "SQL Query Formatter",
          href: "/dev-tools/sql-formatter",
          description: "Format and beautify SQL queries with proper indentation. Essential for database development and debugging."
        }}
        topics={[
          {
            title: "JSON Formatter",
            description: "Format and validate JSON data with syntax highlighting",
            href: "/dev-tools/json-formatter",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "Base64 Encoder/Decoder",
            description: "Encode and decode Base64 strings for data transmission",
            href: "/dev-tools/base64",
            type: "tool",
            category: "Developer Tools"
          },
          {
            title: "Hash Generator",
            description: "Generate MD5, SHA-256, SHA-512 hashes for security",
            href: "/dev-tools/hash-generator",
            type: "tool",
            category: "Developer Tools"
          }
        ]}
      />
    </ToolLayout>
  );
}

"use client";

import { formatSql, SQL_DIALECTS, MAX_SQL_LENGTH, type SqlDialect, type SqlKeywordCase } from "@/lib/sql-format";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Database, Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { recordToolEvent } from "@/lib/tool-events";
import { toast } from "sonner";

import { sqlFormatterArticle } from "@/content/tools/sql-formatter";
export default function SQLFormatter() {
  const [input, setInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [indent, setIndent] = useState(2);
  const [keywordCase, setKeywordCase] = useState<SqlKeywordCase>("upper");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState("");

  const invalidateOutput = () => { setFormatted(""); setError(""); setCopied(false); };
  const handleFormat = () => {
    const started = performance.now();
    recordToolEvent("dev-sql-formatter", "tool_run_started", { size: input.length });
    try {
      setFormatted(formatSql(input, dialect, indent, keywordCase));
      recordToolEvent("dev-sql-formatter", "tool_run_succeeded", { durationMs: performance.now() - started });
      setError("");
      setCopied(false);
    } catch {
      recordToolEvent("dev-sql-formatter", "tool_run_failed", { error: "invalid_input" });
      setFormatted("");
      setError(input.length > MAX_SQL_LENGTH
        ? "Use a query under 100,000 characters to keep formatting responsive."
        : "Unable to format this query. Check the selected dialect and input syntax. Your original SQL is unchanged.");
    }
  };

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    try { await navigator.clipboard.writeText(formatted); }
    catch { toast.error("Could not copy. Select and copy the output manually."); return; }
    recordToolEvent("dev-sql-formatter", "result_copied");
    setCopied(true);
    toast.success("Formatted SQL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [formatted]);

  const handleReset = () => {
    setInput("");
    invalidateOutput();
  };

  const handleSample = () => {
    const sample = "SELECT users.id, users.name, orders.total FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.active = 1 AND orders.total > 100 ORDER BY orders.total DESC LIMIT 10;";
    if (input && !window.confirm("Replace your current SQL with the sample?")) return;
    setInput(sample);
    invalidateOutput();
  };

  const faqs = [
    {
      question: "What SQL dialects are supported?",
      answer: "Choose Standard SQL, PostgreSQL, MySQL, or SQLite before formatting. Vendor extensions and stored procedures may not be supported.",
    },
    {
      question: "Does this validate SQL syntax?",
      answer: "No. Formatting does not validate execution, table names, or query equivalence. Unsupported input may produce a formatting error.",
    },
    {
      question: "Is my SQL query stored anywhere?",
      answer: "No. All SQL formatting happens in your browser. Your queries never leave your device.",
    },
  ];

  return (
    <ToolLayout
      hasDraft={!!input}
      article={sqlFormatterArticle}
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
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <label className="grid gap-1.5 text-sm">SQL dialect
          <select value={dialect} onChange={e => { setDialect(e.target.value as SqlDialect); invalidateOutput(); }} className="h-11 rounded-md border bg-background px-3">
            {Object.entries(SQL_DIALECTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">Indentation
          <select value={indent} onChange={e => { setIndent(Number(e.target.value)); invalidateOutput(); }} className="h-11 rounded-md border bg-background px-3">
            <option value={2}>2 spaces</option><option value={4}>4 spaces</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">Keywords
          <select value={keywordCase} onChange={e => { setKeywordCase(e.target.value as SqlKeywordCase); invalidateOutput(); }} className="h-11 rounded-md border bg-background px-3">
            <option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="preserve">Keep original</option>
          </select>
        </label>
        <label className="cursor-pointer rounded-md border px-3 py-3 text-sm">Import SQL
          <input aria-label="Import SQL file" className="sr-only" type="file" accept=".sql,.txt" onChange={async e => {
            const file = e.target.files?.[0]; e.target.value = "";
            if (!file) return;
            if (file.size > MAX_SQL_LENGTH) { setError("SQL import is limited to 100 KB."); return; }
            try { const text = await file.text(); if (!input || window.confirm("Replace your current SQL with this file?")) { setInput(text); invalidateOutput(); } }
            catch { setError("Unable to read this file. Original SQL is unchanged."); }
          }} />
        </label>
        <Button variant="outline" disabled={!formatted} onClick={() => {
          const url = URL.createObjectURL(new Blob([formatted], { type: "text/plain;charset=utf-8" }));
          const a = document.createElement("a"); a.href = url; a.download = "formatted.sql"; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000); recordToolEvent("dev-sql-formatter", "result_downloaded");
        }}>Download SQL</Button>
        <Button onClick={handleFormat} disabled={!input.trim()} className="h-11">Format SQL</Button>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">Runs locally in your browser. Formatting does not execute or validate your query. Up to 100,000 characters.</p>
      {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
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
            onChange={(e) => { setInput(e.target.value); invalidateOutput(); }}
            aria-label="Input SQL"
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
              aria-label="Formatted SQL"
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

    </ToolLayout>
  );
}

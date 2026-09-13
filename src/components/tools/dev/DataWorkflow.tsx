"use client";
import { useEffect, useRef, useState } from "react";
import { Braces } from "lucide-react";
import ToolLayout from "@/components/shared/ToolLayout";
import NextStepActions from "@/components/shared/NextStepActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTool } from "@/lib/tool-catalog";
import { takeHandoff } from "@/lib/local-handoff";
import { recordToolEvent } from "@/lib/tool-events";
import type { CsvMode } from "@/lib/data-workflows";
import type { WorkflowRequest } from "@/workers/data-workflows.worker";

export type Workflow = "json-csv" | "json-schema" | "json-to-typescript";
const sample = '[{"name":"Ada","active":true,"score":12},{"name":"Grace","active":false,"score":15}]';
const schemaSample = '{"$schema":"http://json-schema.org/draft-07/schema#","type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"active":{"type":"boolean"},"score":{"type":"number"}},"required":["name","active"],"additionalProperties":false}}';
const descriptions: Record<Workflow, string> = {
  "json-csv": "Convert JSON records to CSV, or CSV rows to JSON, with explicit choices for types and spreadsheet handling.",
  "json-schema": "Validate JSON against a local draft-07 schema without sending documents or retrieving remote schemas.",
  "json-to-typescript": "Generate a TypeScript type from a JSON example. Review the inferred shape before using it in your project.",
};
const limitations: Record<Workflow, string[]> = {
  "json-csv": ["Text mode reads all CSV values as strings. JSON null and missing fields become empty text cells; nested values require JSON-cell mode.", "JSON-cell mode encodes headers and values as JSON. Empty cells represent missing properties; null, strings, booleans, numbers, and nesting remain distinct. Use matching mode on import. Spreadsheet applications may still reinterpret numeric cells.", "Spreadsheet protection prefixes risky text cells with an apostrophe. This changes their text and is not removed on import. Disabling it can let spreadsheet applications evaluate formula-like cells.", "Supports comma, semicolon, and tab separators, quoted delimiters, escaped quotes, and multiline cells. Maximum 10,000 records and 200 columns."],
  "json-schema": ["Supports JSON Schema draft-07 only, with strict schema compilation. Unknown keywords are rejected. Format annotations (email, dates, and similar) are not validated.", "Only local # references are supported. Remote schema retrieval is disabled. Defaults, type coercion, and removal of extra properties are disabled.", "A schema match is not proof that the data is correct for your business requirements. Only the first validation error is returned.", "Schemas are limited to 64,000 characters. Processing runs in a worker with a five-second timeout and Cancel control."],
  "json-to-typescript": ["Types reflect one sample, not every possible response. Missing fields, optional properties, enums, and dates cannot be inferred reliably from one example.", "Empty arrays become unknown[]. Mixed arrays become unions, including separate object shapes when keys differ. Property names are escaped JSON strings.", "This generates a type alias, not a runtime validator. Use JSON Schema validation when you need runtime data checks.", "Nesting is limited to 32 levels; arrays allow at most 30 distinct inferred shapes."],
};
export default function DataWorkflow({ kind }: { kind: Workflow }) {
  const tool = getTool(`/dev-tools/${kind}`)!;
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState(schemaSample);
  const [reverse, setReverse] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [csvMode, setCsvMode] = useState<CsvMode>("text");
  const [spreadsheetSafe, setSpreadsheetSafe] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function stop() { workerRef.current?.terminate(); workerRef.current = null; if (timer.current) clearTimeout(timer.current); setRunning(false); }
  function invalidate() { stop(); setOutput(""); setError(""); }
  useEffect(() => {
    const transferred = takeHandoff(tool.href);
    if (transferred !== undefined) setInput(transferred);
    return () => { workerRef.current?.terminate(); if (timer.current) clearTimeout(timer.current); };
  }, [tool.href]);
  function run() {
    invalidate();
    setRunning(true);
    const started = performance.now();
    recordToolEvent(tool.id, "tool_run_started", { size: input.length });
    try {
      const worker = new Worker(new URL("../../../workers/data-workflows.worker.ts", import.meta.url), { type: "module" });
      workerRef.current = worker;
      const fail = (message: string, code: string) => { stop(); setError(message); recordToolEvent(tool.id, "tool_run_failed", { error: code }); };
      worker.onmessage = event => {
        if (event.data.error) fail(event.data.error, "invalid_input");
        else { stop(); setOutput(event.data.output); recordToolEvent(tool.id, "tool_run_succeeded", { durationMs: performance.now() - started }); }
      };
      worker.onerror = () => fail("The processing worker failed. Your original input is unchanged.", "processing_failed");
      timer.current = setTimeout(() => fail("Processing exceeded five seconds. Try a smaller input or simpler schema.", "timeout"), 5000);
      worker.postMessage({ operation: kind === "json-csv" && reverse ? "csv-json" : kind, input, schema, delimiter, csvMode, spreadsheetSafe } satisfies WorkflowRequest);
    } catch { stop(); setError("This browser could not start the processing worker."); }
  }
  async function copy() { try { await navigator.clipboard.writeText(output); recordToolEvent(tool.id, "result_copied"); } catch { setError("Copy was unavailable. Select the output and copy it manually."); } }
  function download() {
    const extension = kind === "json-csv" ? reverse ? "json" : "csv" : kind === "json-to-typescript" ? "ts" : "txt";
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `result.${extension}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    recordToolEvent(tool.id, "result_downloaded");
  }
  return <ToolLayout title={tool.title} description={descriptions[kind]} category="dev" categoryLabel="Developer Tools" icon={Braces} hasDraft={!!input}
    article={{ intro: [descriptions[kind]], sections: [{ heading: "How to use this tool", body: ["Paste input or import a text file, select the options that match your data, and run the tool. Review the result before copying, downloading, or transferring it to another local tool."] }], limitations: limitations[kind] }}>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {kind === "json-csv" && <>
        <label className="text-sm">Direction <select aria-label="Conversion direction" className="min-h-11 rounded border bg-background px-2" value={String(reverse)} onChange={e => { invalidate(); setReverse(e.target.value === "true"); }}><option value="false">JSON to CSV</option><option value="true">CSV to JSON</option></select></label>
        <label className="text-sm">Delimiter <select className="min-h-11 rounded border bg-background px-2" value={delimiter} onChange={e => { invalidate(); setDelimiter(e.target.value); }}><option value=",">Comma</option><option value=";">Semicolon</option><option value={'\t'}>Tab</option></select></label>
        <label className="text-sm">Cells <select className="min-h-11 rounded border bg-background px-2" value={csvMode} onChange={e => { invalidate(); setCsvMode(e.target.value as CsvMode); }}><option value="text">Text (spreadsheet)</option><option value="json-cells">JSON cells (preserve types)</option></select></label>
        {csvMode === "text" && !reverse && <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={spreadsheetSafe} onChange={e => { invalidate(); setSpreadsheetSafe(e.target.checked); }} />Prefix formula-like cells for spreadsheets</label>}
      </>}
      <Button variant="outline" onClick={() => { if (!input || window.confirm("Replace the current input with a sample?")) { invalidate(); setInput(kind === "json-csv" && reverse ? csvMode === "text" ? 'name,score\nAda,12' : '"""name""","""score"""\n"""Ada""",12' : sample); } }}>Load sample</Button>
      <label className="cursor-pointer rounded border px-3 py-3 text-sm">Import text<input aria-label="Import input file" className="sr-only" type="file" accept=".json,.csv,.tsv,.txt" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ""; if (file.size > 1_000_000) { setError("Import is limited to 1 MB."); return; } try { const text = await file.text(); if (!input || window.confirm("Replace the current input with this file?")) { invalidate(); setInput(text); } } catch { setError("Unable to read the file. Original input is unchanged."); } }} /></label>
    </div>
    <p className="mb-4 text-sm text-muted-foreground">{kind === "json-csv" ? csvMode === "text" ? "Text CSV converts all fields to strings. Nulls and missing values become empty cells; spreadsheet protection can add an apostrophe." : "JSON-cell CSV preserves supported JSON types and missing fields. Import it using JSON-cell mode; it is not ordinary spreadsheet CSV." : limitations[kind][0]} All JSON input rejects duplicate keys and unsafe numbers; maximum 1,000,000 characters and 64 levels.</p>
    <div className="grid min-w-0 gap-4 xl:grid-cols-2"><label className="grid gap-2 text-sm">{reverse ? "CSV input" : "JSON input"}<Textarea value={input} onChange={e => { invalidate(); setInput(e.target.value); }} className="min-h-72 font-mono" spellCheck={false} /></label>
    {kind === "json-schema" && <label className="grid gap-2 text-sm">JSON Schema (draft-07)<Textarea value={schema} onChange={e => { invalidate(); setSchema(e.target.value); }} className="min-h-72 font-mono" spellCheck={false} /></label>}</div>
    <div className="my-4 flex gap-2"><Button onClick={run} disabled={!input.trim() || running}>{running ? "Processing…" : kind === "json-schema" ? "Validate JSON" : "Convert"}</Button>{running && <Button variant="outline" onClick={() => { stop(); setError("Cancelled. Input is unchanged."); recordToolEvent(tool.id, "tool_run_failed", { error: "cancelled" }); }}>Cancel</Button>}</div>
    {error && <p role="alert" className="mb-4 whitespace-pre-wrap text-sm text-destructive">{error}</p>}
    <label className="grid gap-2 text-sm">Result<Textarea value={output} readOnly className="min-h-56 font-mono" /></label>
    <div className="mt-3 flex gap-2"><Button variant="outline" disabled={!output} onClick={copy}>Copy result</Button><Button variant="outline" disabled={!output} onClick={download}>Download</Button></div>
    {kind === "json-csv" && reverse && <NextStepActions href={tool.href} output={output} />}
  </ToolLayout>;
}

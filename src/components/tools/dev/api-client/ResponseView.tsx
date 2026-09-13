"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiResponse, ResponseTab, formatBytes, formatTime, getStatusColor } from "./types";

interface ResponseViewProps {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ResponseView({ response, loading, error }: ResponseViewProps) {
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!response) return;
    const text = activeTab === "headers"
      ? JSON.stringify(response.headers, null, 2)
      : response.body;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [response, activeTab]);

  const formattedBody = useMemo(() => {
    if (!response?.body) return "";
    try {
      return JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {
      return response.body;
    }
  }, [response]);

  const highlightedBody = useMemo(() => {
    if (!formattedBody) return null;
    return formattedBody.split("\n").map((line, i) => {
      let highlighted = line;
      highlighted = highlighted.replace(
        /("(?:[^"\\]|\\.)*")(\s*:)/g,
        '<span class="text-sky-400">$1</span>$2'
      );
      highlighted = highlighted.replace(
        /:\s*("(?:[^"\\]|\\.)*")/g,
        (match, val) => match.replace(val, `<span class="text-emerald-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(\d+\.?\d*)/g,
        (match, val) => match.replace(val, `<span class="text-amber-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(true|false)/g,
        (match, val) => match.replace(val, `<span class="text-orange-400">${val}</span>`)
      );
      highlighted = highlighted.replace(
        /:\s*(null)/g,
        (match, val) => match.replace(val, `<span class="text-rose-400">${val}</span>`)
      );
      return (
        <div key={i} className="flex gap-3 px-3 py-0 leading-6 hover:bg-muted/30">
          <span className="text-muted-foreground/40 w-8 text-right select-none shrink-0 text-xs leading-6">
            {i + 1}
          </span>
          <span className="flex-1 whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      );
    });
  }, [formattedBody]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Sending request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-sm text-red-400 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Send a request to see the response</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">
            Enter a URL and click Send
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status Bar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted/30 shrink-0 flex-wrap">
        <span className={cn("text-sm font-bold", getStatusColor(response.status))}>
          {response.status}
        </span>
        <span className="text-xs text-muted-foreground">{response.statusText}</span>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{formatTime(response.time)}</span>
          <span>{formatBytes(response.size)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border shrink-0">
        {(["body", "headers", "raw"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all capitalize cursor-pointer",
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "headers" ? `Headers (${Object.keys(response.headers).length})` : tab}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={handleCopy}>
            {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
            Copy
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "body" && highlightedBody && (
          <div className="font-mono text-sm py-2">{highlightedBody}</div>
        )}
        {activeTab === "body" && !highlightedBody && (
          <pre className="font-mono text-xs p-4 whitespace-pre-wrap break-all text-foreground">
            {response.body || "(empty body)"}
          </pre>
        )}
        {activeTab === "headers" && (
          <div className="p-3 space-y-0.5">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 py-1 font-mono text-xs border-b border-border/50 last:border-0">
                <span className="text-sky-400 shrink-0">{key}:</span>
                <span className="text-foreground break-all">{value}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "raw" && (
          <pre className="font-mono text-xs p-4 whitespace-pre-wrap break-all text-foreground leading-relaxed">
            {response.body}
          </pre>
        )}
      </div>
    </div>
  );
}

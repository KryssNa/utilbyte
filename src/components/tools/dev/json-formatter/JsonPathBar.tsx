"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, ChevronRight, Copy, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { queryJsonPath } from "./useJsonFormatter";

interface JsonPathBarProps {
  parsed: unknown;
  path: string;
  onPathChange: (path: string) => void;
}

export default function JsonPathBar({ parsed, path, onPathChange }: JsonPathBarProps) {
  const [focused, setFocused] = useState(false);

  const { result, error } = queryJsonPath(parsed, path);
  const hasResult = path && !error && result !== undefined;

  const handleCopyResult = useCallback(async () => {
    if (!hasResult) return;
    const text = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
    await navigator.clipboard.writeText(text);
    toast.success("Path result copied!");
  }, [result, hasResult]);

  const resultPreview = hasResult
    ? typeof result === "object"
      ? JSON.stringify(result, null, 2).slice(0, 200)
      : String(result)
    : null;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
          focused ? "border-primary/50 bg-background" : "border-border bg-muted/30",
          error && path ? "border-red-500/50" : ""
        )}
      >
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground text-xs shrink-0">$.</span>
        <input
          type="text"
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter path (e.g. address.city or projects[0].name)"
          className="flex-1 bg-transparent outline-none text-xs font-mono placeholder:text-muted-foreground/50"
        />
        {hasResult && (
          <button
            onClick={handleCopyResult}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Copy result"
          >
            <Copy className="h-3 w-3" />
          </button>
        )}
      </div>

      {path && error && (
        <div className="flex items-center gap-1.5 text-red-400 text-[11px] px-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {hasResult && resultPreview && (
        <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 max-h-32 overflow-auto">
          <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all">
            {resultPreview}
            {resultPreview.length >= 200 && "..."}
          </pre>
        </div>
      )}
    </div>
  );
}

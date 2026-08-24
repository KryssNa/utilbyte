"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface JsonDiffViewProps {
  left: string;
  right: string;
}

interface DiffLine {
  type: "same" | "added" | "removed" | "modified";
  leftLine: string;
  rightLine: string;
  lineNum: number;
}

function computeDiff(leftText: string, rightText: string): DiffLine[] {
  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");
  const maxLen = Math.max(leftLines.length, rightLines.length);
  const lines: DiffLine[] = [];

  for (let i = 0; i < maxLen; i++) {
    const l = leftLines[i] ?? "";
    const r = rightLines[i] ?? "";

    if (l === r) {
      lines.push({ type: "same", leftLine: l, rightLine: r, lineNum: i + 1 });
    } else if (!l && r) {
      lines.push({ type: "added", leftLine: "", rightLine: r, lineNum: i + 1 });
    } else if (l && !r) {
      lines.push({ type: "removed", leftLine: l, rightLine: "", lineNum: i + 1 });
    } else {
      lines.push({ type: "modified", leftLine: l, rightLine: r, lineNum: i + 1 });
    }
  }

  return lines;
}

const bgColors: Record<DiffLine["type"], string> = {
  same: "",
  added: "bg-emerald-500/10",
  removed: "bg-red-500/10",
  modified: "bg-amber-500/10",
};

const textColors: Record<DiffLine["type"], string> = {
  same: "text-foreground/70",
  added: "text-emerald-400",
  removed: "text-red-400",
  modified: "text-amber-400",
};

export default function JsonDiffView({ left, right }: JsonDiffViewProps) {
  const diff = useMemo(() => computeDiff(left, right), [left, right]);

  const changes = diff.filter((d) => d.type !== "same").length;

  if (!left && !right) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-12">
        Paste JSON in the input, then paste another JSON below to compare
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground px-1">
        <span>{diff.length} lines compared</span>
        <span className="text-border">|</span>
        <span className={changes > 0 ? "text-amber-400" : "text-emerald-400"}>
          {changes > 0 ? `${changes} differences found` : "Identical"}
        </span>
        {changes > 0 && (
          <>
            <span className="text-border">|</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-emerald-500/40" /> Added
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-red-500/40" /> Removed
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-amber-500/40" /> Modified
              </span>
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-0 rounded-lg border border-border overflow-hidden font-mono text-xs">
        <div className="border-r border-border">
          <div className="px-3 py-1.5 border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Original
          </div>
          <div className="overflow-auto max-h-[400px]">
            {diff.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 px-3 py-0.5 min-h-[22px]",
                  line.type === "removed" || line.type === "modified" ? bgColors[line.type] : ""
                )}
              >
                <span className="text-muted-foreground/40 w-6 text-right select-none shrink-0">
                  {line.lineNum}
                </span>
                <span
                  className={cn(
                    "flex-1 whitespace-pre-wrap break-all",
                    line.type === "removed" || line.type === "modified"
                      ? textColors[line.type]
                      : "text-foreground/70"
                  )}
                >
                  {line.leftLine}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="px-3 py-1.5 border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Compared
          </div>
          <div className="overflow-auto max-h-[400px]">
            {diff.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 px-3 py-0.5 min-h-[22px]",
                  line.type === "added" || line.type === "modified" ? bgColors[line.type] : ""
                )}
              >
                <span className="text-muted-foreground/40 w-6 text-right select-none shrink-0">
                  {line.lineNum}
                </span>
                <span
                  className={cn(
                    "flex-1 whitespace-pre-wrap break-all",
                    line.type === "added" || line.type === "modified"
                      ? textColors[line.type]
                      : "text-foreground/70"
                  )}
                >
                  {line.rightLine}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

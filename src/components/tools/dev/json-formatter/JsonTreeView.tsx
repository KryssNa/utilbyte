"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

interface TreeNodeProps {
  keyName: string | number | null;
  value: unknown;
  depth: number;
  path: string;
  searchTerm: string;
  onPathClick: (path: string) => void;
}

function getTypeColor(val: unknown): string {
  if (val === null) return "text-rose-400";
  if (typeof val === "string") return "text-emerald-400";
  if (typeof val === "number") return "text-sky-400";
  if (typeof val === "boolean") return "text-amber-400";
  return "text-foreground";
}

function matchesSearch(keyName: string | number | null, val: unknown, search: string): boolean {
  if (!search) return true;
  const lower = search.toLowerCase();
  if (keyName !== null && String(keyName).toLowerCase().includes(lower)) return true;
  if (typeof val === "string" && val.toLowerCase().includes(lower)) return true;
  if (typeof val === "number" && String(val).includes(search)) return true;
  if (typeof val === "boolean" && String(val).includes(lower)) return true;
  if (val === null && "null".includes(lower)) return true;
  if (typeof val === "object" && val !== null) {
    return Object.entries(val as Record<string, unknown>).some(([k, v]) => matchesSearch(k, v, search));
  }
  return false;
}

function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(search.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-amber-500/30 rounded px-0.5">{text.slice(idx, idx + search.length)}</span>
      {text.slice(idx + search.length)}
    </>
  );
}

function TreeNode({ keyName, value, depth, path, searchTerm, onPathClick }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value as Record<string, unknown>) : [];
  const count = isArray ? (value as unknown[]).length : entries.length;

  if (searchTerm && !matchesSearch(keyName, value, searchTerm)) return null;

  const currentPath = keyName !== null
    ? typeof keyName === "number"
      ? `${path}[${keyName}]`
      : path
        ? `${path}.${keyName}`
        : keyName
    : path || "$";

  if (!isObject) {
    return (
      <div
        className="flex items-start gap-1 py-0.5 group cursor-pointer hover:bg-muted/40 rounded px-1 -mx-1"
        style={{ paddingLeft: depth * 16 }}
        onClick={() => onPathClick(String(currentPath))}
      >
        {keyName !== null && (
          <span className="text-foreground/70 shrink-0">
            <HighlightText text={String(keyName)} search={searchTerm} />
            <span className="text-muted-foreground">:</span>{" "}
          </span>
        )}
        <span className={cn("break-all", getTypeColor(value))}>
          {typeof value === "string" ? (
            <>
              &quot;
              <HighlightText text={value} search={searchTerm} />
              &quot;
            </>
          ) : (
            <HighlightText text={String(value)} search={searchTerm} />
          )}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-0.5 py-0.5 cursor-pointer hover:bg-muted/40 rounded px-1 -mx-1 group"
        style={{ paddingLeft: depth * 16 }}
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronRight
          className={cn(
            "h-3 w-3 text-muted-foreground shrink-0 transition-transform duration-150",
            expanded && "rotate-90"
          )}
        />
        {keyName !== null && (
          <span className="text-foreground/70 shrink-0">
            <HighlightText text={String(keyName)} search={searchTerm} />
            <span className="text-muted-foreground">:</span>{" "}
          </span>
        )}
        <span className="text-muted-foreground text-xs">
          {isArray ? `Array[${count}]` : `Object{${count}}`}
        </span>
        <button
          className="ml-1 opacity-0 group-hover:opacity-100 text-[10px] text-primary transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onPathClick(String(currentPath));
          }}
        >
          path
        </button>
      </div>
      {expanded && (
        <div>
          {isArray
            ? (value as unknown[]).map((item, i) => (
                <TreeNode
                  key={i}
                  keyName={i}
                  value={item}
                  depth={depth + 1}
                  path={String(currentPath)}
                  searchTerm={searchTerm}
                  onPathClick={onPathClick}
                />
              ))
            : entries.map(([k, v]) => (
                <TreeNode
                  key={k}
                  keyName={k}
                  value={v}
                  depth={depth + 1}
                  path={String(currentPath)}
                  searchTerm={searchTerm}
                  onPathClick={onPathClick}
                />
              ))}
        </div>
      )}
    </div>
  );
}

interface JsonTreeViewProps {
  data: unknown;
  searchTerm: string;
  onPathClick: (path: string) => void;
}

export default function JsonTreeView({ data, searchTerm, onPathClick }: JsonTreeViewProps) {
  if (data === null || data === undefined) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-12">
        No data to display
      </div>
    );
  }

  return (
    <div className="font-mono text-sm leading-relaxed">
      <TreeNode
        keyName={null}
        value={data}
        depth={0}
        path="$"
        searchTerm={searchTerm}
        onPathClick={onPathClick}
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TOCItem {
  level: number;
  text: string;
  slug: string;
}

interface MarkdownTOCProps {
  content: string;
}

export default function MarkdownTOC({ content }: MarkdownTOCProps) {
  const headings = useMemo(() => {
    if (!content) return [];
    const items: TOCItem[] = [];
    const lines = content.split("\n");
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        items.push({ level, text, slug });
      }
    }

    return items;
  }, [content]);

  if (headings.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-xs p-3">
        <List className="h-3.5 w-3.5" />
        <span>No headings found</span>
      </div>
    );
  }

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="space-y-0.5 p-2">
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <List className="h-3 w-3" />
        Table of Contents
      </div>
      {headings.map((heading, i) => (
        <button
          key={`${heading.slug}-${i}`}
          className={cn(
            "block w-full text-left px-2 py-1 rounded text-xs transition-colors hover:bg-muted truncate",
            heading.level === 1 && "font-semibold text-foreground",
            heading.level === 2 && "font-medium text-foreground/90",
            heading.level >= 3 && "text-muted-foreground"
          )}
          style={{ paddingLeft: `${(heading.level - minLevel) * 12 + 8}px` }}
          title={heading.text}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}

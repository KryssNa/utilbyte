import { useMemo } from "react";

export interface MarkdownStats {
  words: number;
  characters: number;
  lines: number;
  paragraphs: number;
  headings: number;
  links: number;
  images: number;
  codeBlocks: number;
  tables: number;
  readingTime: string;
}

export function useMarkdownStats(content: string): MarkdownStats {
  return useMemo(() => {
    if (!content.trim()) {
      return {
        words: 0,
        characters: 0,
        lines: 0,
        paragraphs: 0,
        headings: 0,
        links: 0,
        images: 0,
        codeBlocks: 0,
        tables: 0,
        readingTime: "0 min",
      };
    }

    const words = content.trim().split(/\s+/).length;
    const characters = content.length;
    const lines = content.split("\n").length;
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const headings = (content.match(/^#{1,6}\s/gm) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const tableRows = (content.match(/^\|.*\|$/gm) || []).length;
    const tables = tableRows > 0 ? Math.max(1, Math.floor(tableRows / 3)) : 0;

    const minutes = Math.ceil(words / 200);
    const readingTime = minutes < 1 ? "< 1 min" : `${minutes} min`;

    return {
      words,
      characters,
      lines,
      paragraphs,
      headings,
      links,
      images,
      codeBlocks,
      tables,
      readingTime,
    };
  }, [content]);
}

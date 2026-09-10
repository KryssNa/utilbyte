export interface SearchableTool {
  title: string;
  desc: string;
  category: string;
  aliases?: readonly string[];
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function distance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + Number(a[i - 1] !== b[j - 1]));
    }
    row = next;
  }
  return row[b.length];
}

export function searchTools<T extends SearchableTool>(tools: readonly T[], query: string): T[] {
  const q = normalizeSearch(query);
  if (!q) return [...tools];
  // Keep fuzzy matching bounded even when a long string is pasted into search.
  if (q.length > 120) return [];
  return tools.map((tool, index) => {
    const title = normalizeSearch(tool.title);
    const aliases = (tool.aliases ?? []).map(normalizeSearch);
    const names = [title, ...aliases];
    const text = normalizeSearch(`${names.join(" ")} ${tool.desc} ${tool.category}`);
    const words = text.split(" ");
    const terms = q.split(" ");
    let score = 0;
    if (title === q) score = 100;
    else if (aliases.includes(q)) score = 90;
    else if (names.some(name => name.startsWith(q))) score = 80;
    else if (names.some(name => name.includes(q))) score = 70;
    else if (terms.every(term => text.includes(term))) score = 50;
    else if (terms.every(term => words.some(word => word.startsWith(term) ||
      (term.length >= 4 && Math.abs(word.length - term.length) <= 2 && distance(term, word) <= (term.length >= 7 ? 2 : 1))))) score = 20;
    return { tool, score, index };
  }).filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(result => result.tool);
}

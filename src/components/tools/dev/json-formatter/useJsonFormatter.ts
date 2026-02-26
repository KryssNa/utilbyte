import { useMemo } from "react";
import type { JsonStats } from "./types";

interface UseJsonFormatterResult {
  formatted: string;
  error: string | null;
  isValid: boolean;
  stats: JsonStats;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed: any;
}

function calculateDepth(obj: unknown, d = 0): number {
  if (typeof obj !== "object" || obj === null) return d;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return d + 1;
    return Math.max(...obj.map((v) => calculateDepth(v, d + 1)));
  }
  const vals = Object.values(obj);
  if (vals.length === 0) return d + 1;
  return Math.max(...vals.map((v) => calculateDepth(v, d + 1)));
}

function collectStats(obj: unknown): Omit<JsonStats, "depth" | "size"> {
  const result = { keys: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };

  function walk(val: unknown) {
    if (val === null) {
      result.nulls++;
      return;
    }
    if (Array.isArray(val)) {
      result.arrays++;
      val.forEach(walk);
      return;
    }
    if (typeof val === "object") {
      result.objects++;
      const entries = Object.entries(val as Record<string, unknown>);
      result.keys += entries.length;
      entries.forEach(([, v]) => walk(v));
      return;
    }
    if (typeof val === "string") result.strings++;
    else if (typeof val === "number") result.numbers++;
    else if (typeof val === "boolean") result.booleans++;
  }

  walk(obj);
  return result;
}

export function useJsonFormatter(input: string, indentSize: number): UseJsonFormatterResult {
  return useMemo((): UseJsonFormatterResult => {
    const trimmed = input.trim();
    if (!trimmed) {
      return {
        formatted: "",
        error: null,
        isValid: true,
        stats: { keys: 0, depth: 0, size: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 },
        parsed: null,
      };
    }

    try {
      const parsed = JSON.parse(trimmed);
      const fmt = JSON.stringify(parsed, null, indentSize);
      const typeStats = collectStats(parsed);

      return {
        formatted: fmt,
        error: null,
        isValid: true,
        stats: {
          ...typeStats,
          depth: calculateDepth(parsed),
          size: new Blob([fmt]).size,
        },
        parsed,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid JSON";
      const match = msg.match(/position (\d+)/);
      let errorDetail = msg;
      if (match) {
        const pos = parseInt(match[1], 10);
        const before = trimmed.substring(Math.max(0, pos - 20), pos);
        const after = trimmed.substring(pos, pos + 20);
        errorDetail = `${msg}\n  ...${before}[HERE]${after}...`;
      }

      return {
        formatted: "",
        error: errorDetail,
        isValid: false,
        stats: { keys: 0, depth: 0, size: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 },
        parsed: null,
      };
    }
  }, [input, indentSize]);
}

export function queryJsonPath(parsed: unknown, path: string): { result: unknown; error: string | null } {
  if (!path || !parsed) return { result: parsed, error: null };

  const cleanPath = path.startsWith("$.") ? path.slice(2) : path.startsWith("$") ? path.slice(1) : path;
  if (!cleanPath) return { result: parsed, error: null };

  const parts = cleanPath.split(/\.|\[(\d+)\]/).filter(Boolean);
  let current: unknown = parsed;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return { result: undefined, error: `Path not found at "${part}"` };
    }
    if (Array.isArray(current)) {
      const idx = parseInt(part, 10);
      if (isNaN(idx) || idx < 0 || idx >= current.length) {
        return { result: undefined, error: `Index ${part} out of bounds (array length: ${current.length})` };
      }
      current = current[idx];
    } else if (typeof current === "object") {
      const obj = current as Record<string, unknown>;
      if (!(part in obj)) {
        return { result: undefined, error: `Key "${part}" not found` };
      }
      current = obj[part];
    } else {
      return { result: undefined, error: `Cannot traverse into ${typeof current} at "${part}"` };
    }
  }

  return { result: current, error: null };
}

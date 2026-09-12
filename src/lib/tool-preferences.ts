import { catalog } from "./tool-catalog";
export const PREFERENCES_KEY = "utilbyte:tools:v1";
export interface ToolPreferences { pinned: string[]; recent: string[]; focus: boolean; compact: boolean; }
export const defaultPreferences: ToolPreferences = { pinned: [], recent: [], focus: false, compact: false };
export function sanitizePreferences(value: unknown): ToolPreferences {
  const data = value && typeof value === "object" ? value as Partial<ToolPreferences> : {};
  const valid = new Set(catalog.map(tool => tool.id));
  const ids = (items: unknown, max: number) => Array.isArray(items) ? [...new Set(items.filter((id): id is string => typeof id === "string" && valid.has(id)))].slice(0, max) : [];
  // Retire the old collapse setting while preserving pins, recents and guide visibility.
  return { pinned: ids(data.pinned, 6), recent: ids(data.recent, 5), focus: data.focus === true, compact: false };
}

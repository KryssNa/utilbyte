import { catalog } from "./tool-catalog";
export const TOOL_EVENTS = ["tool_ready", "tool_run_started", "tool_run_succeeded", "tool_run_failed", "result_copied", "result_downloaded", "navigation_opened", "navigation_destination_selected", "search_zero_results", "focus_mode_changed"] as const;
export type ToolEvent = typeof TOOL_EVENTS[number];
const surfaces = ["drawer", "sidebar", "search", "workspace"];
const errors = ["invalid_input", "unsupported_input", "read_failed", "processing_failed", "timeout", "cancelled"];
export function safeToolEvent(toolId: string, event: string, dimensions: Record<string, unknown> = {}) {
  const tool = catalog.find(item => item.id === toolId);
  if (!tool || !(TOOL_EVENTS as readonly string[]).includes(event)) return null;
  const properties: Record<string, string> = { tool_id: tool.id, processing_mode: tool.processingMode };
  if (surfaces.includes(String(dimensions.surface))) properties.surface = String(dimensions.surface);
  if (errors.includes(String(dimensions.error))) properties.error = String(dimensions.error);
  if (typeof dimensions.durationMs === "number" && Number.isFinite(dimensions.durationMs) && dimensions.durationMs >= 0) properties.duration = dimensions.durationMs < 100 ? "under_100ms" : dimensions.durationMs < 1000 ? "under_1s" : dimensions.durationMs < 10000 ? "under_10s" : "over_10s";
  if (typeof dimensions.size === "number" && Number.isFinite(dimensions.size) && dimensions.size >= 0) properties.size = dimensions.size < 1024 ? "under_1k" : dimensions.size < 100000 ? "under_100k" : "over_100k";
  return { event: event as ToolEvent, properties };
}
export function recordToolEvent(toolId: string, event: ToolEvent, dimensions?: Record<string, unknown>) {
  const safe = safeToolEvent(toolId, event, dimensions);
  if (!safe || typeof window === "undefined" || process.env.NEXT_PUBLIC_TOOL_METRICS !== "true" || navigator.doNotTrack === "1") return;
  void import("@vercel/analytics").then(({ track }) => track(safe.event, safe.properties)).catch(() => {});
}

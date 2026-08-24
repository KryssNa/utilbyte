export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export const HTTP_METHODS: { value: HttpMethod; color: string }[] = [
  { value: "GET", color: "text-emerald-500" },
  { value: "POST", color: "text-sky-500" },
  { value: "PUT", color: "text-amber-500" },
  { value: "PATCH", color: "text-orange-500" },
  { value: "DELETE", color: "text-red-500" },
  { value: "HEAD", color: "text-gray-400" },
  { value: "OPTIONS", color: "text-teal-500" },
];

export type RequestTab = "params" | "headers" | "body" | "auth";
export type ResponseTab = "body" | "headers" | "raw";

export function createPair(): KeyValuePair {
  return { id: crypto.randomUUID(), key: "", value: "", enabled: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "text-emerald-500";
  if (status >= 300 && status < 400) return "text-sky-500";
  if (status >= 400 && status < 500) return "text-amber-500";
  return "text-red-500";
}

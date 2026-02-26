"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Edit2,
  Globe,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CaughtRequest {
  id: string;
  bin_id: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  query_params: Record<string, string>;
  body: string;
  content_type: string;
  ip_address: string;
  created_at: string;
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  POST: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  PUT: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PATCH: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400",
  HEAD: "bg-gray-500/15 text-gray-500",
  OPTIONS: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
};

const STORAGE_KEY = "rc_bin_id";

function generateBinId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function sanitizeBinId(raw: string) {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
}

function formatRelativeTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function tryPrettyJson(text: string): { pretty: string; isJson: boolean } {
  try {
    return { pretty: JSON.stringify(JSON.parse(text), null, 2), isJson: true };
  } catch {
    return { pretty: text, isJson: false };
  }
}

type DetailTab = "body" | "headers" | "query" | "raw";

export default function RequestCatcher() {
  const [binId, setBinId] = useState("");
  const [editingId, setEditingId] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [requests, setRequests] = useState<CaughtRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<CaughtRequest | null>(null);
  const [polling, setPolling] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("body");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevRequestIds = useRef<Set<string>>(new Set());
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const catcherUrl = binId ? `${supabaseUrl}/functions/v1/request-catcher/${binId}` : "";

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setBinId(stored);
    } else {
      const newId = generateBinId();
      setBinId(newId);
      localStorage.setItem(STORAGE_KEY, newId);
    }
  }, []);

  const fetchRequests = useCallback(async (id?: string) => {
    const target = id || binId;
    if (!target) return;
    try {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/request-catcher/${target}?action=list&limit=100`,
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (!data.requests) return;

      const incoming: CaughtRequest[] = data.requests;
      const freshIds = new Set<string>();
      incoming.forEach((r) => {
        if (!prevRequestIds.current.has(r.id)) freshIds.add(r.id);
      });

      if (freshIds.size > 0) {
        setNewIds(freshIds);
        setRequests(incoming);
        setSelectedReq((prev) => {
          if (!prev) {
            const newest = incoming[0];
            return newest || null;
          }
          return prev;
        });
        setTimeout(() => setNewIds(new Set()), 2500);
      } else {
        setRequests(incoming);
      }

      prevRequestIds.current = new Set(incoming.map((r) => r.id));
    } catch {
      // silently fail
    }
  }, [binId, supabaseUrl]);

  useEffect(() => {
    if (!binId) return;
    prevRequestIds.current = new Set();
    fetchRequests(binId);
  }, [binId]);

  useEffect(() => {
    if (!polling || !binId) return;
    pollingRef.current = setInterval(() => fetchRequests(), 2000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [polling, binId, fetchRequests]);

  const handleCopy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleCopyUrl = () => handleCopy(catcherUrl, "url");

  const handleCopyCurl = () => {
    if (!selectedReq) return;
    const headers = Object.entries(selectedReq.headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(" \\\n  ");
    const body = selectedReq.body ? ` \\\n  -d '${selectedReq.body.replace(/'/g, "\\'")}'` : "";
    const curl = `curl -X ${selectedReq.method} "${catcherUrl}${selectedReq.path}" \\\n  ${headers}${body}`;
    handleCopy(curl, "curl");
    toast.success("cURL copied!");
  };

  const handleClear = useCallback(async () => {
    if (!binId) return;
    try {
      await fetch(`${supabaseUrl}/functions/v1/request-catcher/${binId}?action=clear`, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
      });
      setRequests([]);
      setSelectedReq(null);
      prevRequestIds.current = new Set();
      toast.success("All requests cleared");
    } catch {
      toast.error("Failed to clear requests");
    }
  }, [binId, supabaseUrl]);

  const handleNewBin = useCallback(() => {
    const newId = generateBinId();
    setBinId(newId);
    localStorage.setItem(STORAGE_KEY, newId);
    setRequests([]);
    setSelectedReq(null);
    prevRequestIds.current = new Set();
    toast.success("New endpoint created");
  }, []);

  const startEditId = () => {
    setEditValue(binId);
    setEditingId(true);
  };

  const confirmEditId = () => {
    const sanitized = sanitizeBinId(editValue);
    if (!sanitized) { toast.error("Invalid endpoint name"); return; }
    setBinId(sanitized);
    localStorage.setItem(STORAGE_KEY, sanitized);
    setRequests([]);
    setSelectedReq(null);
    prevRequestIds.current = new Set();
    setEditingId(false);
    toast.success("Endpoint updated");
  };

  const selectReq = (req: CaughtRequest) => {
    setSelectedReq(req);
    setDetailTab("body");
  };

  const faqs = [
    {
      question: "What is a request catcher?",
      answer:
        "A request catcher provides a temporary URL that captures all incoming HTTP requests. Use it to debug webhooks, test API integrations, and inspect request payloads in real-time.",
    },
    {
      question: "Will my endpoint survive a page refresh?",
      answer:
        "Yes. Your endpoint ID is saved in your browser's local storage and automatically restored when you revisit the page. All previously captured requests are also restored.",
    },
    {
      question: "Can I customize the endpoint URL?",
      answer:
        "Yes. Click the edit icon next to your endpoint ID to set a custom name. Use lowercase letters, numbers, and hyphens.",
    },
    {
      question: "What HTTP methods are supported?",
      answer:
        "All standard HTTP methods are supported: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.",
    },
    {
      question: "Can I use this for webhook testing?",
      answer:
        "Yes. Copy the endpoint URL and configure your webhook provider to send to it. All incoming requests will appear in real-time.",
    },
  ];

  const bodyContent = selectedReq
    ? tryPrettyJson(selectedReq.body)
    : null;

  return (
    <ToolLayout
      title="Request Catcher"
      description="Capture and inspect incoming HTTP requests in real-time. Perfect for testing webhooks, API callbacks, and debugging integrations."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Globe}
      faqs={faqs}
      relatedTools={[
        { title: "API Client", description: "Send HTTP requests", href: "/dev-tools/api-client", icon: Globe, category: "dev" },
        { title: "WebSocket Client", description: "Connect to WebSocket servers", href: "/dev-tools/websocket-client", icon: Globe, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Globe, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        {/* Endpoint Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full transition-colors",
                polling ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              )} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {polling ? "Listening" : "Paused"}
              </span>
              {requests.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5"
                onClick={() => { setPolling(!polling); toast(polling ? "Paused" : "Resumed listening"); }}
              >
                {polling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {polling ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => fetchRequests()}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={handleClear}
                disabled={requests.length === 0}
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs gap-1.5"
                onClick={handleNewBin}
              >
                <Plus className="h-3 w-3" />
                New
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Endpoint ID Editor */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">Endpoint ID:</span>
              {editingId ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(sanitizeBinId(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEditId();
                      if (e.key === "Escape") setEditingId(false);
                    }}
                    className="flex-1 h-7 px-2 rounded-md border border-primary/50 bg-background text-xs font-mono outline-none"
                    placeholder="my-webhook"
                    maxLength={32}
                  />
                  <Button size="sm" className="h-7 px-2.5 text-xs" onClick={confirmEditId}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditingId(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                    {binId}
                  </span>
                  <button
                    onClick={startEditId}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* URL display and copy */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 min-w-0">
                <code className="flex-1 text-xs font-mono text-foreground truncate">
                  {catcherUrl || "Loading..."}
                </code>
              </div>
              <Button
                size="sm"
                className="h-9 px-3 gap-1.5 shrink-0"
                onClick={handleCopyUrl}
              >
                {copied === "url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy URL
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Send any HTTP request to this URL — GET, POST, PUT, DELETE, etc. All requests are captured instantly.
              Your endpoint is saved and will persist across page refreshes.
            </p>
          </div>
        </div>

        {/* Main Split View */}
        <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: 520 }}>
          {/* Request List */}
          <div className="lg:w-[300px] shrink-0 rounded-xl border border-border bg-card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Incoming Requests
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {requests.length === 0 ? "None yet" : `${requests.length} captured`}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center px-5">
                  {polling ? (
                    <Wifi className="h-9 w-9 text-emerald-500/40 mb-3" />
                  ) : (
                    <WifiOff className="h-9 w-9 text-muted-foreground/30 mb-3" />
                  )}
                  <p className="text-sm font-medium text-muted-foreground">
                    {polling ? "Waiting for requests..." : "Paused"}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1 leading-relaxed">
                    Copy the URL above and send any HTTP request to it
                  </p>
                  <div className="mt-4 bg-muted/60 rounded-lg p-2.5 text-left w-full">
                    <p className="text-[10px] text-muted-foreground font-mono mb-1">Quick test:</p>
                    <code className="text-[10px] font-mono text-foreground break-all leading-relaxed">
                      curl -X POST "{catcherUrl}" \<br />
                      {"  "}-H "Content-Type: application/json" \<br />
                      {"  "}-d {`'{"hello":"world"}'`}
                    </code>
                    <button
                      onClick={() => {
                        const cmd = `curl -X POST "${catcherUrl}" -H "Content-Type: application/json" -d '{"hello":"world"}'`;
                        handleCopy(cmd, "quickcurl");
                        toast.success("cURL copied!");
                      }}
                      className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copied === "quickcurl" ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                      Copy command
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {requests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => selectReq(req)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 transition-all hover:bg-muted/50 cursor-pointer group relative",
                        selectedReq?.id === req.id && "bg-muted/70",
                        newIds.has(req.id) && "animate-pulse bg-emerald-500/5"
                      )}
                    >
                      {newIds.has(req.id) && (
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 tabular-nums",
                          METHOD_COLORS[req.method] || "bg-gray-500/15 text-gray-400"
                        )}>
                          {req.method}
                        </span>
                        <span className="text-xs font-mono text-foreground truncate flex-1">
                          {req.path || "/"}
                        </span>
                        <ChevronRight className={cn(
                          "h-3 w-3 text-muted-foreground/40 shrink-0 transition-transform",
                          selectedReq?.id === req.id && "translate-x-0.5 text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{formatRelativeTime(req.created_at)}</span>
                        {req.content_type && (
                          <>
                            <span>·</span>
                            <span className="truncate">{req.content_type.split(";")[0]}</span>
                          </>
                        )}
                        {req.body && (
                          <>
                            <span>·</span>
                            <span>{req.body.length}B</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Request Detail */}
          <div className="flex-1 rounded-xl border border-border bg-card flex flex-col overflow-hidden min-w-0">
            {selectedReq ? (
              <>
                {/* Detail Header */}
                <div className="px-4 py-3 border-b border-border bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-bold shrink-0",
                      METHOD_COLORS[selectedReq.method] || "bg-gray-500/15 text-gray-400"
                    )}>
                      {selectedReq.method}
                    </span>
                    <span className="font-mono text-sm text-foreground truncate flex-1 min-w-0">
                      {selectedReq.path || "/"}
                    </span>
                    <div className="flex items-center gap-1 ml-auto shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(selectedReq.created_at).toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] gap-1 ml-1"
                        onClick={handleCopyCurl}
                      >
                        {copied === "curl" ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                        cURL
                      </Button>
                    </div>
                  </div>
                  {selectedReq.ip_address && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      IP: {selectedReq.ip_address}
                    </p>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-muted/20 shrink-0">
                  {([
                    { key: "body", label: "Body", badge: selectedReq.body ? selectedReq.body.length + "B" : null },
                    { key: "headers", label: "Headers", badge: Object.keys(selectedReq.headers).length },
                    { key: "query", label: "Query", badge: Object.keys(selectedReq.query_params).length || null },
                    { key: "raw", label: "Raw", badge: null },
                  ] as { key: DetailTab; label: string; badge: string | number | null }[]).map(({ key, label, badge }) => (
                    <button
                      key={key}
                      onClick={() => setDetailTab(key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                        detailTab === key
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                      {badge !== null && badge !== 0 && (
                        <span className={cn(
                          "text-[9px] font-semibold px-1 py-0 rounded",
                          detailTab === key ? "bg-muted text-muted-foreground" : "bg-muted/60 text-muted-foreground"
                        )}>
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-auto p-4 min-h-0">
                  {detailTab === "body" && (
                    <div className="h-full">
                      {selectedReq.body ? (
                        <div className="relative h-full">
                          {bodyContent?.isJson && (
                            <span className="absolute top-0 right-0 text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded font-medium">
                              JSON
                            </span>
                          )}
                          <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed">
                            {bodyContent?.pretty}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <p className="text-sm text-muted-foreground">No request body</p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1">
                            This request had no body content
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === "headers" && (
                    <div className="space-y-0">
                      {Object.entries(selectedReq.headers).length === 0 ? (
                        <p className="text-xs text-muted-foreground py-8 text-center">No headers</p>
                      ) : (
                        Object.entries(selectedReq.headers).map(([key, value]) => (
                          <div key={key} className="flex gap-3 py-1.5 font-mono text-xs border-b border-border/40 last:border-0 group">
                            <span className="text-sky-500 dark:text-sky-400 shrink-0 min-w-[180px] font-medium">{key}</span>
                            <span className="text-foreground break-all flex-1">{value}</span>
                            <button
                              onClick={() => handleCopy(value, `h-${key}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
                            >
                              {copied === `h-${key}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {detailTab === "query" && (
                    <div className="space-y-0">
                      {Object.entries(selectedReq.query_params).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <p className="text-sm text-muted-foreground">No query parameters</p>
                        </div>
                      ) : (
                        Object.entries(selectedReq.query_params).map(([key, value]) => (
                          <div key={key} className="flex gap-3 py-1.5 font-mono text-xs border-b border-border/40 last:border-0 group">
                            <span className="text-amber-500 dark:text-amber-400 shrink-0 min-w-[120px] font-medium">{key}</span>
                            <span className="text-foreground break-all flex-1">{value}</span>
                            <button
                              onClick={() => handleCopy(value, `q-${key}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
                            >
                              {copied === `q-${key}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {detailTab === "raw" && (
                    <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed">
                      {`${selectedReq.method} ${selectedReq.path || "/"} HTTP/1.1\n`}
                      {Object.entries(selectedReq.headers)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n")}
                      {selectedReq.body ? `\n\n${selectedReq.body}` : ""}
                    </pre>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                <Globe className="h-10 w-10 text-muted-foreground/25 mb-4" />
                <p className="text-sm font-medium text-muted-foreground">
                  {requests.length > 0 ? "Select a request to inspect" : "No requests captured yet"}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1.5 max-w-xs leading-relaxed">
                  {requests.length > 0
                    ? "Click any request in the list to see its full details"
                    : "Requests will appear here automatically as they arrive"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Edit2,
  ExternalLink,
  Globe,
  HelpCircle,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Terminal,
  Trash2,
  Wifi,
  WifiOff,
  X,
  Zap,
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
  forward_status: number | null;
  forward_error: string | null;
  forward_response: string | null;
  forwarded_at: string | null;
}

interface BinConfig {
  bin_id: string;
  forward_url: string;
  forward_enabled: boolean;
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

function forwardStatusBadge(status: number | null, error: string | null) {
  if (error) return { label: "Forward failed", cls: "bg-red-500/15 text-red-500" };
  if (!status) return null;
  if (status >= 200 && status < 300) return { label: `→ ${status}`, cls: "bg-emerald-500/15 text-emerald-500" };
  if (status >= 400) return { label: `→ ${status}`, cls: "bg-red-500/15 text-red-500" };
  return { label: `→ ${status}`, cls: "bg-amber-500/15 text-amber-500" };
}

type DetailTab = "body" | "headers" | "query" | "raw" | "forward";
type MainTab = "inspector" | "proxy" | "help";

const PROXY_TOOLS = [
  {
    name: "ngrok",
    install: "brew install ngrok  # or download from ngrok.com",
    cmd: () => `ngrok http 3000`,
    note: "A free ngrok account is required. Sign up at ngrok.com to get your authtoken.",
  },
  {
    name: "localtunnel",
    install: "npm install -g localtunnel",
    cmd: () => `lt --port 3000`,
    note: "Subdomain availability is not guaranteed on free tier.",
  },
  {
    name: "cloudflared",
    install: "brew install cloudflare/cloudflare/cloudflared",
    cmd: () => `cloudflared tunnel --url http://localhost:3000`,
    note: "Generates a random *.trycloudflare.com URL. No account required.",
  },
];

export default function RequestCatcher() {
  const [binId, setBinId] = useState("");
  const [editingId, setEditingId] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [requests, setRequests] = useState<CaughtRequest[]>([]);
  const [binConfig, setBinConfig] = useState<BinConfig | null>(null);
  const [selectedReq, setSelectedReq] = useState<CaughtRequest | null>(null);
  const [polling, setPolling] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("body");
  const [mainTab, setMainTab] = useState<MainTab>("inspector");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [forwardUrlInput, setForwardUrlInput] = useState("");
  const [forwardEnabled, setForwardEnabled] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [selectedProxyTool, setSelectedProxyTool] = useState(0);
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
          if (!prev) return incoming[0] || null;
          return prev;
        });
        setTimeout(() => setNewIds(new Set()), 2500);
      } else {
        setRequests(incoming);
      }

      prevRequestIds.current = new Set(incoming.map((r) => r.id));

      if (data.bin) {
        setBinConfig(data.bin);
        setForwardUrlInput(data.bin.forward_url || "");
        setForwardEnabled(data.bin.forward_enabled || false);
      }
    } catch {
      // silently fail
    }
  }, [binId, supabaseUrl]);

  useEffect(() => {
    if (!binId) return;
    prevRequestIds.current = new Set();
    fetchRequests(binId);
  }, [binId, fetchRequests]);

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
    const headerStr = Object.entries(selectedReq.headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(" \\\n  ");
    const bodyStr = selectedReq.body ? ` \\\n  -d '${selectedReq.body.replace(/'/g, "\\'")}'` : "";
    const curl = `curl -X ${selectedReq.method} "${catcherUrl}${selectedReq.path}" \\\n  ${headerStr}${bodyStr}`;
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
    setBinConfig(null);
    setForwardUrlInput("");
    setForwardEnabled(false);
    prevRequestIds.current = new Set();
    toast.success("New endpoint created");
  }, []);

  const startEditId = () => { setEditValue(binId); setEditingId(true); };

  const confirmEditId = () => {
    const sanitized = sanitizeBinId(editValue);
    if (!sanitized) { toast.error("Invalid endpoint name"); return; }
    setBinId(sanitized);
    localStorage.setItem(STORAGE_KEY, sanitized);
    setRequests([]);
    setSelectedReq(null);
    setBinConfig(null);
    setForwardUrlInput("");
    setForwardEnabled(false);
    prevRequestIds.current = new Set();
    setEditingId(false);
    toast.success("Endpoint updated");
  };

  const handleSaveConfig = async () => {
    if (!binId) return;
    setSavingConfig(true);
    try {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/request-catcher/${binId}?action=set-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ forward_url: forwardUrlInput.trim(), forward_enabled: forwardEnabled }),
        }
      );
      const data = await res.json();
      if (data.saved) {
        setBinConfig({ bin_id: binId, forward_url: forwardUrlInput.trim(), forward_enabled: forwardEnabled });
        toast.success(forwardEnabled && forwardUrlInput.trim() ? "Forwarding enabled" : "Forwarding disabled");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  };

  const selectReq = (req: CaughtRequest) => { setSelectedReq(req); setDetailTab("body"); };

  const bodyContent = selectedReq ? tryPrettyJson(selectedReq.body) : null;
  const isForwarding = binConfig?.forward_enabled && !!binConfig?.forward_url;

  const faqs = [
    {
      question: "What is a request catcher?",
      answer: "A request catcher provides a public URL that captures all incoming HTTP requests. Use it to debug webhooks, test API integrations, and inspect payloads in real-time.",
    },
    {
      question: "How does the proxy/forwarding feature work?",
      answer: "Set a Forward Target URL (e.g., your ngrok tunnel). Every request sent to your catcher URL will be captured AND simultaneously forwarded to that target — like a transparent reverse proxy. You see the response status in the request detail.",
    },
    {
      question: "Can I use this with localhost?",
      answer: "Directly, no — our servers cannot reach your localhost. Use a tunnel tool like ngrok, localtunnel, or cloudflared to expose your local server publicly. The Proxy Setup tab shows exact commands.",
    },
    {
      question: "Will my endpoint survive a page refresh?",
      answer: "Yes. Your endpoint ID is saved in browser local storage and automatically restored. All captured requests are also restored.",
    },
    {
      question: "What HTTP methods are supported?",
      answer: "All standard HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.",
    },
  ];

  return (
    <ToolLayout
      title="Request Catcher"
      description="Capture and inspect incoming HTTP requests in real-time. Forward to localhost via ngrok or any tunnel — perfect for webhook testing and API debugging."
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
              <div className={cn("h-2 w-2 rounded-full transition-colors", polling ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {polling ? "Listening" : "Paused"}
              </span>
              {isForwarding && (
                <span className="flex items-center gap-1 bg-sky-500/10 text-sky-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  <Zap className="h-2.5 w-2.5" />
                  Forwarding
                </span>
              )}
              {requests.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5"
                onClick={() => { setPolling(!polling); toast(polling ? "Paused" : "Resumed listening"); }}>
                {polling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {polling ? "Pause" : "Resume"}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => fetchRequests()}>
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={handleClear} disabled={requests.length === 0}>
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs gap-1.5" onClick={handleNewBin}>
                <Plus className="h-3 w-3" />
                New
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">Endpoint ID:</span>
              {editingId ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(sanitizeBinId(e.target.value))}
                    onKeyDown={(e) => { if (e.key === "Enter") confirmEditId(); if (e.key === "Escape") setEditingId(false); }}
                    className="flex-1 h-7 px-2 rounded-md border border-primary/50 bg-background text-xs font-mono outline-none"
                    placeholder="my-webhook"
                    maxLength={32}
                  />
                  <Button size="sm" className="h-7 px-2.5 text-xs" onClick={confirmEditId}><Check className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditingId(false)}><X className="h-3 w-3" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{binId}</span>
                  <button onClick={startEditId} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 min-w-0">
                <code className="flex-1 text-xs font-mono text-foreground truncate">{catcherUrl || "Loading..."}</code>
              </div>
              <Button size="sm" className="h-9 px-3 gap-1.5 shrink-0" onClick={handleCopyUrl}>
                {copied === "url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy URL
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Send any HTTP request to this URL — it will be captured instantly and optionally forwarded to your local server.
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {([
            { key: "inspector", label: "Request Inspector", icon: Globe },
            { key: "proxy", label: "Proxy Setup", icon: Zap },
            { key: "help", label: "How It Works", icon: HelpCircle },
          ] as { key: MainTab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMainTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-all -mb-px cursor-pointer",
                mainTab === key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Inspector Tab */}
        {mainTab === "inspector" && (
          <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: 520 }}>
            {/* Request List */}
            <div className="lg:w-[300px] shrink-0 rounded-xl border border-border bg-card flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Incoming Requests</span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {requests.length === 0 ? "None yet" : `${requests.length} captured`}
                </span>
              </div>

              <div className="flex-1 overflow-auto">
                {requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center px-5">
                    {polling ? <Wifi className="h-9 w-9 text-emerald-500/40 mb-3" /> : <WifiOff className="h-9 w-9 text-muted-foreground/30 mb-3" />}
                    <p className="text-sm font-medium text-muted-foreground">{polling ? "Waiting for requests..." : "Paused"}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1 leading-relaxed">Copy the URL above and send any HTTP request</p>
                    <div className="mt-4 bg-muted/60 rounded-lg p-2.5 text-left w-full">
                      <p className="text-[10px] text-muted-foreground font-mono mb-1">Quick test:</p>
                      <code className="text-[10px] font-mono text-foreground break-all leading-relaxed">
                        curl -X POST "{catcherUrl}" \<br />
                        {"  "}-H "Content-Type: application/json" \<br />
                        {"  "}-d {`'{"hello":"world"}'`}
                      </code>
                      <button
                        onClick={() => { handleCopy(`curl -X POST "${catcherUrl}" -H "Content-Type: application/json" -d '{"hello":"world"}'`, "quickcurl"); toast.success("cURL copied!"); }}
                        className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {copied === "quickcurl" ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                        Copy command
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {requests.map((req) => {
                      const fwdBadge = forwardStatusBadge(req.forward_status, req.forward_error);
                      return (
                        <button
                          key={req.id}
                          onClick={() => selectReq(req)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 transition-all hover:bg-muted/50 cursor-pointer relative",
                            selectedReq?.id === req.id && "bg-muted/70",
                            newIds.has(req.id) && "bg-emerald-500/5"
                          )}
                        >
                          {newIds.has(req.id) && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0", METHOD_COLORS[req.method] || "bg-gray-500/15 text-gray-400")}>
                              {req.method}
                            </span>
                            <span className="text-xs font-mono text-foreground truncate flex-1">{req.path || "/"}</span>
                            <ChevronRight className={cn("h-3 w-3 text-muted-foreground/40 shrink-0", selectedReq?.id === req.id && "text-muted-foreground")} />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                            <span>{formatRelativeTime(req.created_at)}</span>
                            {req.content_type && <><span>·</span><span className="truncate">{req.content_type.split(";")[0]}</span></>}
                            {fwdBadge && <span className={cn("px-1 py-0 rounded text-[10px] font-semibold", fwdBadge.cls)}>{fwdBadge.label}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Request Detail */}
            <div className="flex-1 rounded-xl border border-border bg-card flex flex-col overflow-hidden min-w-0">
              {selectedReq ? (
                <>
                  <div className="px-4 py-3 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold shrink-0", METHOD_COLORS[selectedReq.method] || "bg-gray-500/15 text-gray-400")}>
                        {selectedReq.method}
                      </span>
                      <span className="font-mono text-sm text-foreground truncate flex-1 min-w-0">{selectedReq.path || "/"}</span>
                      <div className="flex items-center gap-1 ml-auto shrink-0">
                        {selectedReq.forward_status && (
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded", forwardStatusBadge(selectedReq.forward_status, selectedReq.forward_error)?.cls)}>
                            Fwd → {selectedReq.forward_status}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground ml-1">{new Date(selectedReq.created_at).toLocaleString()}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 ml-1" onClick={handleCopyCurl}>
                          {copied === "curl" ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
                          cURL
                        </Button>
                      </div>
                    </div>
                    {selectedReq.ip_address && <p className="text-[10px] text-muted-foreground mt-1">IP: {selectedReq.ip_address}</p>}
                  </div>

                  <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-muted/20 shrink-0">
                    {([
                      { key: "body", label: "Body", badge: selectedReq.body ? selectedReq.body.length + "B" : null },
                      { key: "headers", label: "Headers", badge: Object.keys(selectedReq.headers).length },
                      { key: "query", label: "Query", badge: Object.keys(selectedReq.query_params).length || null },
                      { key: "raw", label: "Raw", badge: null },
                      ...(selectedReq.forwarded_at ? [{ key: "forward" as DetailTab, label: "Forward", badge: selectedReq.forward_status ? String(selectedReq.forward_status) : "err" }] : []),
                    ] as { key: DetailTab; label: string; badge: string | number | null }[]).map(({ key, label, badge }) => (
                      <button
                        key={key}
                        onClick={() => setDetailTab(key)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                          detailTab === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {label}
                        {badge !== null && badge !== 0 && (
                          <span className={cn("text-[9px] font-semibold px-1 py-0 rounded", detailTab === key ? "bg-muted text-muted-foreground" : "bg-muted/60 text-muted-foreground")}>
                            {badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-auto p-4 min-h-0">
                    {detailTab === "body" && (
                      selectedReq.body ? (
                        <div className="relative">
                          {bodyContent?.isJson && <span className="absolute top-0 right-0 text-[10px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded font-medium">JSON</span>}
                          <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed">{bodyContent?.pretty}</pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <p className="text-sm text-muted-foreground">No request body</p>
                        </div>
                      )
                    )}

                    {detailTab === "headers" && (
                      <div>
                        {Object.entries(selectedReq.headers).length === 0 ? (
                          <p className="text-xs text-muted-foreground py-8 text-center">No headers</p>
                        ) : (
                          Object.entries(selectedReq.headers).map(([key, value]) => (
                            <div key={key} className="flex gap-3 py-1.5 font-mono text-xs border-b border-border/40 last:border-0 group">
                              <span className="text-sky-500 dark:text-sky-400 shrink-0 min-w-[180px] font-medium">{key}</span>
                              <span className="text-foreground break-all flex-1">{value}</span>
                              <button onClick={() => handleCopy(value, `h-${key}`)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0">
                                {copied === `h-${key}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {detailTab === "query" && (
                      Object.entries(selectedReq.query_params).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <p className="text-sm text-muted-foreground">No query parameters</p>
                        </div>
                      ) : (
                        Object.entries(selectedReq.query_params).map(([key, value]) => (
                          <div key={key} className="flex gap-3 py-1.5 font-mono text-xs border-b border-border/40 last:border-0 group">
                            <span className="text-amber-500 dark:text-amber-400 shrink-0 min-w-[120px] font-medium">{key}</span>
                            <span className="text-foreground break-all flex-1">{value}</span>
                            <button onClick={() => handleCopy(value, `q-${key}`)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0">
                              {copied === `q-${key}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        ))
                      )
                    )}

                    {detailTab === "raw" && (
                      <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed">
                        {`${selectedReq.method} ${selectedReq.path || "/"} HTTP/1.1\n`}
                        {Object.entries(selectedReq.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}
                        {selectedReq.body ? `\n\n${selectedReq.body}` : ""}
                      </pre>
                    )}

                    {detailTab === "forward" && selectedReq.forwarded_at && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">Forwarded to:</span>
                          <code className="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded">{binConfig?.forward_url}</code>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">Status:</span>
                          {selectedReq.forward_error ? (
                            <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                              <AlertCircle className="h-3.5 w-3.5" />
                              {selectedReq.forward_error}
                            </span>
                          ) : (
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", forwardStatusBadge(selectedReq.forward_status, null)?.cls)}>
                              HTTP {selectedReq.forward_status}
                            </span>
                          )}
                        </div>
                        {selectedReq.forward_response && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Response body:</p>
                            <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed bg-muted/40 rounded-lg p-3">
                              {tryPrettyJson(selectedReq.forward_response).pretty}
                            </pre>
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground">Forwarded at {new Date(selectedReq.forwarded_at).toLocaleString()}</p>
                      </div>
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
                    {requests.length > 0 ? "Click any request to see its full details" : "Requests will appear here automatically as they arrive"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proxy Setup Tab */}
        {mainTab === "proxy" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-500" />
                <span className="text-sm font-semibold">Forward Target</span>
                {isForwarding && (
                  <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-2.5 w-2.5" />
                    Active
                  </span>
                )}
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every request sent to your catcher URL will also be forwarded to the URL below in real-time.
                  Use a tunnel tool (ngrok, localtunnel, cloudflared) to forward to your localhost — see instructions below.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Forward to URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={forwardUrlInput}
                      onChange={(e) => setForwardUrlInput(e.target.value)}
                      placeholder="https://your-tunnel.ngrok.io  or  https://myapi.example.com"
                      className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    For localhost: paste the public tunnel URL here. For public servers: paste the server URL directly.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForwardEnabled(!forwardEnabled)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer",
                      forwardEnabled ? "bg-sky-500" : "bg-muted-foreground/30"
                    )}
                  >
                    <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform", forwardEnabled ? "translate-x-4" : "translate-x-0.5")} />
                  </button>
                  <span className="text-xs text-foreground font-medium">{forwardEnabled ? "Forwarding enabled" : "Forwarding disabled"}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSaveConfig} disabled={savingConfig}>
                    {savingConfig ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save Config
                  </Button>
                  {(forwardUrlInput || forwardEnabled) && (
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground"
                      onClick={() => { setForwardEnabled(false); setForwardUrlInput(""); }}>
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tunnel Tool Instructions */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Expose Localhost via Tunnel</span>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our servers cannot reach your localhost directly. Use one of these free tools to create a secure public tunnel,
                  then paste that URL in the Forward Target above.
                </p>

                <div className="flex items-center gap-2">
                  {PROXY_TOOLS.map((tool, i) => (
                    <button key={tool.name} onClick={() => setSelectedProxyTool(i)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                        selectedProxyTool === i ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground")}>
                      {tool.name}
                    </button>
                  ))}
                </div>

                {(() => {
                  const tool = PROXY_TOOLS[selectedProxyTool];
                  return (
                    <div className="space-y-3">
                      {[
                        { step: "1", title: "Install", code: tool.install },
                        { step: "2", title: "Start the tunnel (change 3000 to your port)", code: tool.cmd() },
                        { step: "3", title: "Copy the public HTTPS URL it prints (e.g. https://abc123.ngrok.io)", code: null },
                        { step: "4", title: "Paste that URL in Forward Target above → Save Config", code: null },
                      ].map(({ step, title, code }) => (
                        <div key={step} className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40">
                            <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{step}</span>
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
                          </div>
                          {code && (
                            <div className="relative p-3">
                              <code className="font-mono text-xs text-foreground whitespace-pre">{code}</code>
                              <button onClick={() => { handleCopy(code, `tool-${step}`); toast.success("Copied!"); }}
                                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors">
                                {copied === `tool-${step}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {tool.note && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                          {tool.note}
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Step 5: test */}
                <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40">
                    <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">5</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Send a test request to your catcher URL
                    </span>
                  </div>
                  <div className="relative p-3">
                    <code className="font-mono text-xs text-foreground break-all">
                      {`curl -X POST "${catcherUrl}" \\`}<br />
                      {`  -H "Content-Type: application/json" \\`}<br />
                      {`  -d '{"test":"forwarded"}'`}
                    </code>
                    <button
                      onClick={() => { handleCopy(`curl -X POST "${catcherUrl}" -H "Content-Type: application/json" -d '{"test":"forwarded"}'`, "step5curl"); toast.success("cURL copied!"); }}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === "step5curl" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Tab */}
        {mainTab === "help" && (
          <div className="space-y-4">
            {/* Architecture */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-4">How Request Forwarding Works</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
                {[
                  { label: "Webhook\nSender", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
                  null,
                  { label: "Catcher URL\n(public)", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                  null,
                  { label: "ngrok /\ntunnel", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                  null,
                  { label: "localhost\n:3000", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
                ].map((node, i) =>
                  node === null ? (
                    <ArrowRight key={i} className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  ) : (
                    <div key={i} className={cn("px-3 py-2 rounded-lg border text-center whitespace-pre-line leading-tight", node.color)}>{node.label}</div>
                  )
                )}
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-3">
                Requests are captured in the Inspector AND forwarded to your local server simultaneously
              </p>
            </div>

            {/* Full guide */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <span className="text-sm font-semibold">Complete Setup Guide</span>
              </div>
              <div className="divide-y divide-border/50">
                {[
                  { step: "1", title: "Get your unique catcher URL", desc: "A URL is automatically generated and saved to your browser. You can rename it by clicking the edit icon next to your Endpoint ID.", code: null },
                  { step: "2", title: "Start your local server", desc: "Make sure your local application is running on a known port.", code: "npm run dev   # starts on port 3000 by default" },
                  { step: "3", title: "Install ngrok (or any tunnel tool)", desc: "ngrok exposes your local port to the internet via a secure tunnel. Free accounts work for basic testing.", code: "brew install ngrok\n# or download from ngrok.com" },
                  { step: "4", title: "Start the tunnel", desc: "Run ngrok targeting your local port. Copy the HTTPS URL it prints.", code: "ngrok http 3000" },
                  { step: "5", title: "Configure forwarding", desc: 'Go to the "Proxy Setup" tab, paste the ngrok URL in "Forward to URL", enable forwarding, and click Save Config.' , code: null },
                  { step: "6", title: "Point your webhook provider to the catcher URL", desc: "In Stripe, GitHub, Shopify etc., set the webhook destination to your catcher URL. All requests are captured AND forwarded to your localhost.", code: null },
                  { step: "7", title: "Inspect and debug in real-time", desc: "Watch requests appear in the Inspector. Click any request to see headers, body, query params. The Forward tab shows your local server's response.", code: null },
                ].map(({ step, title, desc, code }) => (
                  <div key={step} className="flex gap-4 p-4">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{step}</div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                      {code && (
                        <div className="relative mt-2">
                          <pre className="bg-muted/60 rounded-lg px-3 py-2 font-mono text-xs text-foreground whitespace-pre-wrap">{code}</pre>
                          <button onClick={() => { handleCopy(code, `guide-${step}`); toast.success("Copied!"); }}
                            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            {copied === `guide-${step}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Important Notes</span>
              </div>
              {[
                "Forwarding has a 15-second timeout. Long-running local handlers may time out.",
                "Forwarded response bodies are capped at 10KB for display — the full request is always forwarded.",
                "Authorization headers are stripped before forwarding to prevent credential leakage.",
                "If your local server is down, the request is still captured — forwarding fails gracefully with an error message.",
                "Multiple simultaneous requests are handled concurrently — each is independently forwarded.",
                "The catcher URL is public. Anyone with your bin ID can send requests. Use a custom ID for sensitive testing.",
              ].map((note, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-50" />
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

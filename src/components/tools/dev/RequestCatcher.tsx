"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Pause,
  Play,
  RotateCcw,
  Trash2,
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
  GET: "bg-emerald-500/15 text-emerald-500",
  POST: "bg-sky-500/15 text-sky-500",
  PUT: "bg-amber-500/15 text-amber-500",
  PATCH: "bg-orange-500/15 text-orange-500",
  DELETE: "bg-red-500/15 text-red-500",
  HEAD: "bg-gray-500/15 text-gray-400",
  OPTIONS: "bg-teal-500/15 text-teal-500",
};

function generateBinId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function RequestCatcher() {
  const [binId, setBinId] = useState("");
  const [requests, setRequests] = useState<CaughtRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<CaughtRequest | null>(null);
  const [polling, setPolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailTab, setDetailTab] = useState<"headers" | "body" | "query">("headers");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const catcherUrl = binId
    ? `${supabaseUrl}/functions/v1/request-catcher/${binId}`
    : "";

  const initBin = useCallback(() => {
    const newId = generateBinId();
    setBinId(newId);
    setRequests([]);
    setSelectedReq(null);
    setPolling(true);
  }, []);

  useEffect(() => {
    initBin();
  }, [initBin]);

  const fetchRequests = useCallback(async () => {
    if (!binId) return;
    try {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/request-catcher/${binId}?action=list&limit=100`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch {
      // silently fail polling
    }
  }, [binId, supabaseUrl]);

  useEffect(() => {
    if (polling && binId) {
      fetchRequests();
      pollingRef.current = setInterval(fetchRequests, 2000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [polling, binId, fetchRequests]);

  const handleCopyUrl = useCallback(async () => {
    if (!catcherUrl) return;
    await navigator.clipboard.writeText(catcherUrl);
    setCopied(true);
    toast.success("URL copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [catcherUrl]);

  const handleClear = useCallback(async () => {
    if (!binId) return;
    try {
      await fetch(
        `${supabaseUrl}/functions/v1/request-catcher/${binId}?action=clear`
      );
      setRequests([]);
      setSelectedReq(null);
      toast.success("Requests cleared");
    } catch {
      toast.error("Failed to clear");
    }
  }, [binId, supabaseUrl]);

  const handleNewBin = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    initBin();
    toast.success("New endpoint created");
  }, [initBin]);

  const faqs = [
    {
      question: "What is a request catcher?",
      answer:
        "A request catcher provides a temporary URL endpoint that captures and displays all incoming HTTP requests. It's useful for debugging webhooks, testing API integrations, and inspecting request payloads.",
    },
    {
      question: "How long are requests stored?",
      answer:
        "Requests are stored temporarily for your session. You can clear them anytime or generate a new endpoint. They are not persisted permanently.",
    },
    {
      question: "What HTTP methods are supported?",
      answer:
        "All standard HTTP methods are supported: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.",
    },
    {
      question: "Can I use this for webhook testing?",
      answer:
        "Yes. Copy the endpoint URL and paste it into any webhook configuration. All requests sent to this URL will be captured and displayed in real-time.",
    },
  ];

  return (
    <ToolLayout
      title="Request Catcher"
      description="Capture and inspect HTTP requests in real-time. Perfect for debugging webhooks, testing API integrations, and inspecting payloads."
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
        {/* Endpoint URL Bar */}
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2.5 w-2.5 rounded-full",
                polling ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              )} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {polling ? "Listening" : "Paused"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setPolling(!polling)}
              >
                {polling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {polling ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={handleClear}
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={handleNewBin}
              >
                <RotateCcw className="h-3 w-3" />
                New Endpoint
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground overflow-x-auto whitespace-nowrap">
              {catcherUrl || "Generating..."}
            </div>
            <Button
              variant="default"
              size="sm"
              className="h-9 px-3 gap-1.5 shrink-0"
              onClick={handleCopyUrl}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </Button>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            Send any HTTP request to this URL to capture it. Use tools like cURL, Postman, or configure webhooks to point here.
          </p>
        </div>

        {/* Main Split View */}
        <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
          {/* Request List */}
          <div className="lg:w-2/5 rounded-xl border border-border bg-muted/20 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Requests
              </span>
              <span className="text-[10px] text-muted-foreground">
                {requests.length} captured
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                  <ExternalLink className="h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">Waiting for requests...</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Send a request to your endpoint URL
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {requests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => {
                        setSelectedReq(req);
                        setDetailTab("headers");
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer",
                        selectedReq?.id === req.id && "bg-muted/60"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0",
                          METHOD_COLORS[req.method] || "bg-gray-500/15 text-gray-400"
                        )}>
                          {req.method}
                        </span>
                        <span className="text-xs font-mono text-foreground truncate">
                          {req.path}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                          {formatTimestamp(req.created_at)}
                        </span>
                      </div>
                      {req.content_type && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {req.content_type}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Request Detail */}
          <div className="lg:w-3/5 rounded-xl border border-border bg-muted/20 flex flex-col">
            {selectedReq ? (
              <>
                <div className="px-3 py-2 border-b border-border bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-bold",
                      METHOD_COLORS[selectedReq.method] || "bg-gray-500/15 text-gray-400"
                    )}>
                      {selectedReq.method}
                    </span>
                    <span className="text-sm font-mono text-foreground truncate">
                      {selectedReq.path}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {new Date(selectedReq.created_at).toLocaleString()}
                    </span>
                  </div>
                  {selectedReq.ip_address && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      From: {selectedReq.ip_address}
                    </p>
                  )}
                </div>

                {/* Detail Tabs */}
                <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted/20 shrink-0">
                  {(["headers", "body", "query"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                        detailTab === tab
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab === "headers" && `Headers (${Object.keys(selectedReq.headers).length})`}
                      {tab === "body" && "Body"}
                      {tab === "query" && `Query (${Object.keys(selectedReq.query_params).length})`}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-auto p-3">
                  {detailTab === "headers" && (
                    <div className="space-y-0.5">
                      {Object.entries(selectedReq.headers).map(([key, value]) => (
                        <div key={key} className="flex gap-2 py-1 font-mono text-xs border-b border-border/50 last:border-0">
                          <span className="text-sky-400 shrink-0 min-w-[140px]">{key}:</span>
                          <span className="text-foreground break-all">{value}</span>
                        </div>
                      ))}
                      {Object.keys(selectedReq.headers).length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">No headers</p>
                      )}
                    </div>
                  )}

                  {detailTab === "body" && (
                    <div>
                      {selectedReq.body ? (
                        <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all leading-relaxed">
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(selectedReq.body), null, 2);
                            } catch {
                              return selectedReq.body;
                            }
                          })()}
                        </pre>
                      ) : (
                        <p className="text-xs text-muted-foreground py-4 text-center">No body content</p>
                      )}
                    </div>
                  )}

                  {detailTab === "query" && (
                    <div className="space-y-0.5">
                      {Object.entries(selectedReq.query_params).map(([key, value]) => (
                        <div key={key} className="flex gap-2 py-1 font-mono text-xs border-b border-border/50 last:border-0">
                          <span className="text-amber-400 shrink-0">{key}:</span>
                          <span className="text-foreground break-all">{value}</span>
                        </div>
                      ))}
                      {Object.keys(selectedReq.query_params).length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">No query parameters</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <Globe className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Select a request to inspect</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

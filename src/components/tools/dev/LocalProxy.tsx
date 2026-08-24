"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  Edit2,
  ExternalLink,
  Globe,
  RefreshCw,
  Save,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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

const PROXY_TOOLS = [
  {
    name: "ngrok",
    install: "brew install ngrok  # or download from ngrok.com",
    cmd: () => `ngrok http 3000`,
    note: "A free ngrok account is required. Sign up at ngrok.com and run: ngrok config add-authtoken <token>",
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

type MainTab = "setup" | "help";

export default function LocalProxy() {
  const [binId, setBinId] = useState("");
  const [editingId, setEditingId] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [forwardUrlInput, setForwardUrlInput] = useState("");
  const [forwardEnabled, setForwardEnabled] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedProxyTool, setSelectedProxyTool] = useState(0);
  const [mainTab, setMainTab] = useState<MainTab>("setup");
  const [copied, setCopied] = useState<string | null>(null);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const catcherUrl = binId ? `${supabaseUrl}/functions/v1/request-catcher/${binId}` : "";

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const id = stored || generateBinId();
    if (!stored) localStorage.setItem(STORAGE_KEY, id);
    setBinId(id);
  }, []);

  useEffect(() => {
    if (!binId) return;
    const load = async () => {
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/request-catcher/${binId}?action=list&limit=1`,
          { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` } }
        );
        const data = await res.json();
        if (data.bin) {
          setForwardUrlInput(data.bin.forward_url || "");
          setForwardEnabled(data.bin.forward_enabled || false);
          setIsActive(data.bin.forward_enabled && !!data.bin.forward_url);
        }
      } catch {
        // silently fail
      }
    };
    load();
  }, [binId, supabaseUrl]);

  const handleCopy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const startEditId = () => { setEditValue(binId); setEditingId(true); };

  const confirmEditId = () => {
    const sanitized = sanitizeBinId(editValue);
    if (!sanitized) { toast.error("Invalid endpoint name"); return; }
    setBinId(sanitized);
    localStorage.setItem(STORAGE_KEY, sanitized);
    setForwardUrlInput("");
    setForwardEnabled(false);
    setIsActive(false);
    setEditingId(false);
    toast.success("Endpoint ID updated — same as Request Catcher");
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
        const active = forwardEnabled && !!forwardUrlInput.trim();
        setIsActive(active);
        toast.success(active ? "Forwarding is now active" : "Forwarding disabled");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  };

  const faqs = [
    {
      question: "What is Local Proxy?",
      answer: "Local Proxy forwards every request received at your Request Catcher URL to a target URL you specify — such as your ngrok tunnel pointing to localhost. It acts like a transparent reverse proxy.",
    },
    {
      question: "Why can't I just forward directly to localhost?",
      answer: "Our edge servers cannot reach your machine's localhost. You need a tunnel tool (ngrok, localtunnel, cloudflared) to create a public URL that routes to your local port.",
    },
    {
      question: "Does it use the same endpoint as the Request Catcher?",
      answer: "Yes. Both tools share the same endpoint ID stored in your browser. Configure forwarding here, then visit the Request Catcher to watch requests arrive and see forward responses.",
    },
    {
      question: "What happens if my local server is down?",
      answer: "The request is still captured by the Request Catcher. Forwarding will fail gracefully and log an error message visible in the Forward tab of each request.",
    },
    {
      question: "Is there a request size or rate limit?",
      answer: "Forwarding has a 15-second timeout per request. Response bodies over 10KB are truncated in the display but the full request is always forwarded to your server.",
    },
  ];

  return (
    <ToolLayout
      title="Local Proxy"
      description="Forward requests from your public catcher URL to localhost via ngrok or any tunnel. Debug webhooks directly on your local machine."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Zap}
      faqs={faqs}
      relatedTools={[
        { title: "Request Catcher", description: "Capture & inspect HTTP requests", href: "/dev-tools/request-catcher", icon: Globe, category: "dev" },
        { title: "API Client", description: "Send HTTP requests", href: "/dev-tools/api-client", icon: Globe, category: "dev" },
        { title: "WebSocket Client", description: "Connect to WebSocket servers", href: "/dev-tools/websocket-client", icon: Globe, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        {/* Status Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full transition-colors", isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {isActive ? "Proxy Active" : "Proxy Inactive"}
              </span>
            </div>
            {isActive && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Forwarding to {forwardUrlInput}
              </span>
            )}
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
              <Button size="sm" variant="outline" className="h-9 px-3 gap-1.5 shrink-0" onClick={() => handleCopy(catcherUrl, "url")}>
                {copied === "url" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy URL
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              This endpoint ID is shared with the Request Catcher. Requests sent to the URL above will be captured there and forwarded here.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {([
            { key: "setup", label: "Proxy Setup", icon: Zap },
            { key: "help", label: "How It Works", icon: Terminal },
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

        {/* Setup Tab */}
        {mainTab === "setup" && (
          <div className="space-y-5">
            {/* Forward Target */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-500" />
                <span className="text-sm font-semibold">Forward Target</span>
                {isActive && (
                  <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-2.5 w-2.5" />
                    Active
                  </span>
                )}
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every request received at your catcher URL will be forwarded to the target below in real-time — headers, body, method, and path all preserved.
                  Use a tunnel URL to reach your localhost, or any public HTTPS URL.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Forward to URL</label>
                  <input
                    type="url"
                    value={forwardUrlInput}
                    onChange={(e) => setForwardUrlInput(e.target.value)}
                    placeholder="https://abc123.ngrok.io  or  https://myapi.example.com"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono outline-none focus:border-primary/60 transition-colors"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    For localhost: paste the ngrok/tunnel public URL. For production: paste any HTTPS URL.
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
                    <span className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
                      forwardEnabled ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </button>
                  <span className="text-xs text-foreground font-medium">
                    {forwardEnabled ? "Forwarding enabled" : "Forwarding disabled"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSaveConfig} disabled={savingConfig}>
                    {savingConfig ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save Config
                  </Button>
                  {(forwardUrlInput || forwardEnabled) && (
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground"
                      onClick={() => { setForwardEnabled(false); setForwardUrlInput(""); setIsActive(false); }}>
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tunnel Setup */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Expose Localhost via Tunnel</span>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our edge servers cannot reach your localhost. These free tools create a secure public tunnel to your local port.
                  Run one, copy the public URL, and paste it in the Forward Target above.
                </p>

                <div className="flex items-center gap-2">
                  {PROXY_TOOLS.map((tool, i) => (
                    <button key={tool.name} onClick={() => setSelectedProxyTool(i)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                        selectedProxyTool === i ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                      )}>
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
                        { step: "2", title: "Start tunnel (replace 3000 with your port)", code: tool.cmd() },
                        { step: "3", title: "Copy the public HTTPS URL it prints", code: null },
                        { step: "4", title: "Paste into Forward Target above and click Save Config", code: null },
                      ].map(({ step, title, code }) => (
                        <div key={step} className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40">
                            <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                              {step}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
                          </div>
                          {code && (
                            <div className="relative p-3">
                              <code className="font-mono text-xs text-foreground whitespace-pre">{code}</code>
                              <button
                                onClick={() => { handleCopy(code, `tool-${step}`); toast.success("Copied!"); }}
                                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                              >
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

                {/* Test step */}
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
                      onClick={() => {
                        handleCopy(`curl -X POST "${catcherUrl}" -H "Content-Type: application/json" -d '{"test":"forwarded"}'`, "testcurl");
                        toast.success("cURL copied!");
                      }}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === "testcurl" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  After sending, open the{" "}
                  <a href="/dev-tools/request-catcher" className="text-primary underline underline-offset-2">Request Catcher</a>{" "}
                  to see the captured request and its forward response.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Tab */}
        {mainTab === "help" && (
          <div className="space-y-4">
            {/* Architecture */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-4">Architecture</h3>
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
                    <div key={i} className={cn("px-3 py-2 rounded-lg border text-center whitespace-pre-line leading-tight", node.color)}>
                      {node.label}
                    </div>
                  )
                )}
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-3">
                Requests are captured in the Inspector AND forwarded to your local server simultaneously.
                Each request is independent and handled concurrently.
              </p>
            </div>

            {/* Full guide */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <span className="text-sm font-semibold">Complete Setup Guide</span>
              </div>
              <div className="divide-y divide-border/50">
                {[
                  {
                    step: "1",
                    title: "Start your local server",
                    desc: "Make sure your application is running locally on a known port (e.g. 3000).",
                    code: "npm run dev",
                  },
                  {
                    step: "2",
                    title: "Install ngrok",
                    desc: "ngrok creates a secure HTTPS tunnel from a public URL to your local port. Create a free account at ngrok.com to get your authtoken.",
                    code: "brew install ngrok\nngrok config add-authtoken <your-token>",
                  },
                  {
                    step: "3",
                    title: "Start the tunnel",
                    desc: "Run ngrok pointing at your local port. It will print a public HTTPS URL.",
                    code: "ngrok http 3000",
                  },
                  {
                    step: "4",
                    title: "Paste the tunnel URL into Forward Target",
                    desc: 'Copy the HTTPS URL ngrok prints (e.g. https://abc123.ngrok.io), paste it into the "Forward to URL" field in the Proxy Setup tab, enable forwarding, and click Save Config.',
                    code: null,
                  },
                  {
                    step: "5",
                    title: "Point your webhook provider to the catcher URL",
                    desc: "In Stripe, GitHub, Shopify, or any other service, set the webhook destination to your catcher URL. All requests will be captured AND forwarded to your localhost.",
                    code: null,
                  },
                  {
                    step: "6",
                    title: "Inspect in the Request Catcher",
                    desc: "Visit the Request Catcher tool to watch requests arrive in real-time. Click any request to see its headers, body, query params, and the response from your local server.",
                    code: null,
                  },
                ].map(({ step, title, desc, code }) => (
                  <div key={step} className="flex gap-4 p-4">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                      {code && (
                        <div className="relative mt-2">
                          <pre className="bg-muted/60 rounded-lg px-3 py-2 font-mono text-xs text-foreground whitespace-pre-wrap">{code}</pre>
                          <button
                            onClick={() => { handleCopy(code, `guide-${step}`); toast.success("Copied!"); }}
                            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copied === `guide-${step}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important notes */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Important Notes</span>
              </div>
              {[
                "Forwarding has a 15-second timeout per request. Long-running local handlers may time out.",
                "Forwarded response bodies are capped at 10KB in the display — the full request is always forwarded.",
                "Authorization headers are stripped before forwarding to prevent credential leakage.",
                "If your local server is down, the request is still captured — forwarding fails gracefully.",
                "Multiple simultaneous requests are handled concurrently — each forwarded independently.",
                "Both this tool and Request Catcher share the same endpoint ID from your browser storage.",
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

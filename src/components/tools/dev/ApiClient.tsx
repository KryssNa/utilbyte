"use client";

import { readLimitedText, MAX_RESPONSE_BYTES } from "../../../../supabase/functions/_shared/proxy-policy";
import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Send, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import KeyValueEditor from "./api-client/KeyValueEditor";
import ResponseView from "./api-client/ResponseView";
import { apiClientArticle } from "@/content/tools/api-client";
import {
  ApiResponse,
  HTTP_METHODS,
  HttpMethod,
  KeyValuePair,
  RequestTab,
  createPair,
} from "./api-client/types";

export default function ApiClient() {
  const [requestMode, setRequestMode] = useState<"direct" | "proxy">("direct");
  const [proxyToken, setProxyToken] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [requestTab, setRequestTab] = useState<RequestTab>("params");
  const [params, setParams] = useState<KeyValuePair[]>([createPair()]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: crypto.randomUUID(), key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState<"none" | "bearer" | "basic">("none");
  const [authToken, setAuthToken] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = useCallback(() => {
    let base = url.trim();
    if (!base) return "";
    if (!base.startsWith("http://") && !base.startsWith("https://")) {
      base = "https://" + base;
    }
    const enabledParams = params.filter((p) => p.enabled && p.key.trim());
    if (enabledParams.length === 0) return base;
    const qs = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
    return base.includes("?") ? `${base}&${qs}` : `${base}?${qs}`;
  }, [url, params]);

  const handleSend = useCallback(async () => {
    const targetUrl = buildUrl();
    if (!targetUrl) {
      toast.error("Enter a URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const reqHeaders: Record<string, string> = {};
      headers
        .filter((h) => h.enabled && h.key.trim())
        .forEach((h) => {
          reqHeaders[h.key] = h.value;
        });

      if (authType === "bearer" && authToken) {
        reqHeaders["Authorization"] = `Bearer ${authToken}`;
      } else if (authType === "basic" && authUser) {
        reqHeaders["Authorization"] = `Basic ${btoa(`${authUser}:${authPass}`)}`;
      }

      const target = new URL(targetUrl);
      if (!["https:", "http:"].includes(target.protocol) || target.username || target.password) throw new Error("Use an HTTP or HTTPS URL without embedded credentials");
      const started = performance.now();
      const res = requestMode === "proxy" ? await fetch("/api/proxy", {
        method: "POST", headers: { "Content-Type": "application/json", "x-utilbyte-proxy-token": proxyToken },
        body: JSON.stringify({ url: targetUrl, method, headers: reqHeaders, body: !["GET", "HEAD"].includes(method) ? body : "" }),
        signal: AbortSignal.timeout(15000),
      }) : await fetch(targetUrl, {
        method, headers: reqHeaders, body: !["GET", "HEAD"].includes(method) ? body : undefined,
        mode: "cors", credentials: "omit", redirect: "error", signal: AbortSignal.timeout(10000),
      });
      const responseText = await readLimitedText(res.body, MAX_RESPONSE_BYTES);
      const data = requestMode === "proxy" ? JSON.parse(responseText) : {
        status: res.status, statusText: res.statusText, headers: Object.fromEntries(res.headers.entries()),
        body: responseText, size: new TextEncoder().encode(responseText).byteLength, time: performance.now() - started,
      };

      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError(err instanceof TypeError ? "Request failed. The destination must permit browser CORS, or use an operator-enabled proxy." : err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [buildUrl, method, headers, body, authType, authToken, authUser, authPass, requestMode, proxyToken]);

  const handleReset = useCallback(() => {
    setProxyToken("");
    setUrl("");
    setMethod("GET");
    setParams([createPair()]);
    setHeaders([
      { id: crypto.randomUUID(), key: "Content-Type", value: "application/json", enabled: true },
    ]);
    setBody("");
    setAuthType("none");
    setAuthToken("");
    setAuthUser("");
    setAuthPass("");
    setResponse(null);
    setError(null);
    toast.success("Cleared");
  }, []);

  const methodMeta = HTTP_METHODS.find((m) => m.value === method) || HTTP_METHODS[0];

  const faqs = [
    {
      question: "What is an API client?",
      answer:
        "An API client lets you construct HTTP requests and inspect responses. By default, requests go directly from your browser to destinations that permit CORS. An optional operator proxy requires an access token and an approved HTTPS destination.",
    },
    {
      question: "Why does this use a proxy?",
      answer:
        "Direct mode follows browser CORS rules. Server proxy mode is restricted to operator-approved HTTPS origins and requires a separate proxy access token. Both the relay and destination receive your request in proxy mode.",
    },
    {
      question: "What authentication methods are supported?",
      answer:
        "Bearer token and Basic authentication are supported. Select the auth type, enter your credentials, and the appropriate Authorization header will be added automatically.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Direct requests go to the destination. Proxy-mode requests, including target credentials or body you enter, pass through the UtilByte relay and destination. The separate proxy access token is not forwarded to the destination. The proxy handler does not explicitly save requests, but that does not establish a no-logging policy for hosting providers or destinations. Use synthetic data and test credentials.",
    },
  ];

  return (
    <ToolLayout
      article={apiClientArticle}
      title="API Client"
      description="Send browser requests to CORS-enabled endpoints, or use a restricted operator proxy. Inspect responses using test credentials and synthetic data."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Send}
      faqs={faqs}
      relatedTools={[
        { title: "Request Catcher", description: "Capture incoming HTTP requests", href: "/dev-tools/request-catcher", icon: Send, category: "dev" },
        { title: "WebSocket Client", description: "Connect to WebSocket servers", href: "/dev-tools/websocket-client", icon: Send, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: Send, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        <label className="grid gap-2 text-sm">Connection
          <select aria-label="Request connection" value={requestMode} onChange={event => setRequestMode(event.target.value as "direct" | "proxy")} className="min-h-11 rounded border bg-background px-3">
            <option value="direct">Direct from browser (CORS required)</option><option value="proxy">Operator server proxy</option>
          </select>
        </label>
        {requestMode === "proxy" && <label className="grid gap-2 text-sm">Proxy access token
          <input type="password" value={proxyToken} onChange={event => setProxyToken(event.target.value)} autoComplete="off" className="min-h-11 rounded border bg-background px-3" />
          <span className="text-xs text-muted-foreground">Available only when the operator has enabled your destination. This token stays in this page's memory until cleared or closed.</span>
        </label>}
        {/* URL Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className={cn(
                "h-10 pl-3 pr-8 rounded-lg border border-border bg-muted/40 text-sm font-bold outline-none appearance-none cursor-pointer",
                methodMeta.color
              )}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.value}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono outline-none focus:border-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            className="h-10 px-5 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Request Config + Response */}
        <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
          {/* Request Config */}
          <div className="lg:w-2/5 rounded-xl border border-border bg-muted/20 flex flex-col">
            <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted/30 shrink-0">
              {(["params", "headers", "body", "auth"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRequestTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-all capitalize cursor-pointer",
                    requestTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-3">
              {requestTab === "params" && (
                <KeyValueEditor
                  pairs={params}
                  onChange={setParams}
                  keyPlaceholder="Parameter"
                  valuePlaceholder="Value"
                />
              )}

              {requestTab === "headers" && (
                <KeyValueEditor
                  pairs={headers}
                  onChange={setHeaders}
                  keyPlaceholder="Header"
                  valuePlaceholder="Value"
                />
              )}

              {requestTab === "body" && (
                <div className="space-y-2">
                  {["GET", "HEAD"].includes(method) && (
                    <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1.5">
                      Body is not used with {method} requests
                    </p>
                  )}
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={'{\n  "key": "value"\n}'}
                    className="w-full min-h-[300px] font-mono text-sm bg-background border border-border rounded-lg resize-none p-3 outline-none placeholder:text-muted-foreground/50 leading-relaxed focus:border-primary/50"
                    spellCheck={false}
                  />
                </div>
              )}

              {requestTab === "auth" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
                    {(["none", "bearer", "basic"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAuthType(t)}
                        className={cn(
                          "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all capitalize cursor-pointer",
                          authType === t
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {authType === "bearer" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Token</label>
                      <input
                        type="text"
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        placeholder="Enter bearer token..."
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs font-mono outline-none focus:border-primary/50"
                      />
                    </div>
                  )}

                  {authType === "basic" && (
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Username</label>
                        <input
                          type="text"
                          value={authUser}
                          onChange={(e) => setAuthUser(e.target.value)}
                          placeholder="Username"
                          className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs font-mono outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Password</label>
                        <input
                          type="password"
                          value={authPass}
                          onChange={(e) => setAuthPass(e.target.value)}
                          placeholder="Password"
                          className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs font-mono outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                  )}

                  {authType === "none" && (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No authentication configured
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Response */}
          <div className="lg:w-3/5 rounded-xl border border-border bg-muted/20 flex flex-col min-h-[400px]">
            <ResponseView response={response} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

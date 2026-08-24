"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Plug,
  PlugZap,
  RotateCcw,
  Send,
  Trash2,
  Unplug,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface WsMessage {
  id: string;
  direction: "sent" | "received";
  data: string;
  timestamp: Date;
  size: number;
}

const STATE_COLORS: Record<ConnectionState, string> = {
  disconnected: "bg-gray-400",
  connecting: "bg-amber-500 animate-pulse",
  connected: "bg-emerald-500",
  error: "bg-red-500",
};

const STATE_LABELS: Record<ConnectionState, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting...",
  connected: "Connected",
  error: "Error",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function tryFormatJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export default function WebSocketClient() {
  const [url, setUrl] = useState("wss://echo.websocket.org");
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<WsMessage | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [formatJson, setFormatJson] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error("Enter a WebSocket URL");
      return;
    }

    let wsUrl = trimmedUrl;
    if (!wsUrl.startsWith("ws://") && !wsUrl.startsWith("wss://")) {
      wsUrl = "wss://" + wsUrl;
    }

    setConnectionState("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState("connected");
        toast.success("Connected");
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            direction: "received",
            data: `[Connected to ${wsUrl}]`,
            timestamp: new Date(),
            size: 0,
          },
        ]);
      };

      ws.onmessage = (event) => {
        const data = typeof event.data === "string" ? event.data : String(event.data);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            direction: "received",
            data,
            timestamp: new Date(),
            size: new TextEncoder().encode(data).length,
          },
        ]);
      };

      ws.onerror = () => {
        setConnectionState("error");
      };

      ws.onclose = (event) => {
        setConnectionState("disconnected");
        wsRef.current = null;
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            direction: "received",
            data: `[Disconnected: ${event.code} ${event.reason || "Connection closed"}]`,
            timestamp: new Date(),
            size: 0,
          },
        ]);
      };
    } catch (err) {
      setConnectionState("error");
      toast.error(err instanceof Error ? err.message : "Connection failed");
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState("disconnected");
  }, []);

  const sendMessage = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error("Not connected");
      return;
    }

    const msg = inputMessage;
    if (!msg.trim()) return;

    wsRef.current.send(msg);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        direction: "sent",
        data: msg,
        timestamp: new Date(),
        size: new TextEncoder().encode(msg).length,
      },
    ]);
    setInputMessage("");
  }, [inputMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSelectedMsg(null);
    toast.success("Cleared");
  }, []);

  const handleCopyMessage = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  }, []);

  const sentCount = messages.filter((m) => m.direction === "sent").length;
  const receivedCount = messages.filter((m) => m.direction === "received").length;

  const faqs = [
    {
      question: "What is a WebSocket client?",
      answer:
        "A WebSocket client connects to a WebSocket server and enables real-time, bidirectional communication. Unlike HTTP, the connection stays open for continuous message exchange.",
    },
    {
      question: "What is the echo server?",
      answer:
        "wss://echo.websocket.org is a public test server that echoes back any message you send. It is useful for testing WebSocket connections.",
    },
    {
      question: "Can I send JSON messages?",
      answer:
        "Yes. Type or paste JSON in the message input and it will be sent as-is. Received JSON messages are automatically formatted for readability.",
    },
    {
      question: "Is the connection secure?",
      answer:
        "Connections using wss:// are encrypted with TLS, just like HTTPS. The WebSocket connection runs directly from your browser -- no data is proxied through our servers.",
    },
  ];

  return (
    <ToolLayout
      title="WebSocket Client"
      description="Connect to any WebSocket server, send and receive messages in real-time. Perfect for debugging WebSocket APIs and testing real-time connections."
      category="dev"
      categoryLabel="Developer Tools"
      icon={PlugZap}
      faqs={faqs}
      relatedTools={[
        { title: "API Client", description: "Send HTTP requests", href: "/dev-tools/api-client", icon: PlugZap, category: "dev" },
        { title: "Request Catcher", description: "Capture HTTP requests", href: "/dev-tools/request-catcher", icon: PlugZap, category: "dev" },
        { title: "JSON Formatter", description: "Format JSON data", href: "/dev-tools/json-formatter", icon: PlugZap, category: "dev" },
      ]}
    >
      <div className="space-y-4">
        {/* Connection Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn("h-2.5 w-2.5 rounded-full", STATE_COLORS[connectionState])} />
            <span className="text-xs font-medium text-muted-foreground w-20">
              {STATE_LABELS[connectionState]}
            </span>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="wss://echo.websocket.org"
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono outline-none focus:border-primary/50"
            disabled={connectionState === "connected"}
            onKeyDown={(e) => {
              if (e.key === "Enter" && connectionState === "disconnected") connect();
            }}
          />
          {connectionState === "connected" ? (
            <Button variant="destructive" className="h-10 px-5 gap-2" onClick={disconnect}>
              <Unplug className="h-4 w-4" />
              Disconnect
            </Button>
          ) : (
            <Button
              className="h-10 px-5 gap-2"
              onClick={connect}
              disabled={connectionState === "connecting"}
            >
              <Plug className="h-4 w-4" />
              Connect
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
          {/* Messages List */}
          <div className="lg:w-1/2 rounded-xl border border-border bg-muted/20 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Messages
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-2.5 w-2.5 text-sky-500" />
                    {sentCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDown className="h-2.5 w-2.5 text-emerald-500" />
                    {receivedCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                    autoScroll ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Auto-scroll
                </button>
                <button
                  onClick={() => setFormatJson(!formatJson)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                    formatJson ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Format JSON
                </button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={clearMessages}>
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            <div ref={messageListRef} className="flex-1 overflow-auto min-h-[300px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                  <PlugZap className="h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Connect to a server to start sending and receiving messages
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {messages.map((msg) => {
                    const isSystem = msg.data.startsWith("[") && msg.data.endsWith("]");
                    return (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedMsg(msg)}
                        className={cn(
                          "w-full text-left px-3 py-2 transition-colors hover:bg-muted/50 cursor-pointer",
                          selectedMsg?.id === msg.id && "bg-muted/60",
                          isSystem && "opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          {isSystem ? (
                            <span className="text-[10px] font-medium text-muted-foreground">SYSTEM</span>
                          ) : msg.direction === "sent" ? (
                            <ArrowUp className="h-3 w-3 text-sky-500 shrink-0" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-emerald-500 shrink-0" />
                          )}
                          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.size > 0 && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatBytes(msg.size)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-foreground truncate">
                          {msg.data.length > 120 ? msg.data.slice(0, 120) + "..." : msg.data}
                        </p>
                      </button>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Send Message */}
            <div className="border-t border-border p-2 shrink-0">
              <div className="flex items-center gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={connectionState === "connected" ? "Type a message..." : "Connect first..."}
                  disabled={connectionState !== "connected"}
                  className="flex-1 h-9 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono outline-none focus:border-primary/50 resize-none disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-9 px-3 gap-1.5"
                  disabled={connectionState !== "connected" || !inputMessage.trim()}
                  onClick={sendMessage}
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:w-1/2 rounded-xl border border-border bg-muted/20 flex flex-col">
            {selectedMsg ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
                  <div className="flex items-center gap-2">
                    {selectedMsg.direction === "sent" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-sky-500" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                    <span className="text-xs font-medium">
                      {selectedMsg.direction === "sent" ? "Sent" : "Received"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(selectedMsg.timestamp)}
                    </span>
                    {selectedMsg.size > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {formatBytes(selectedMsg.size)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] gap-1"
                    onClick={() => handleCopyMessage(selectedMsg.data)}
                  >
                    <Copy className="h-2.5 w-2.5" />
                    Copy
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-3">
                  <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all leading-relaxed">
                    {formatJson ? tryFormatJson(selectedMsg.data) : selectedMsg.data}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <PlugZap className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Select a message to inspect</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

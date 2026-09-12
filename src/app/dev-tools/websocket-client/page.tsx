import { createToolMetadata } from "@/lib/tool-metadata";

import WebSocketClient from "@/components/tools/dev/WebSocketClient";

export const metadata = createToolMetadata("/dev-tools/websocket-client", {
  title: "WebSocket Client Online Free - Test WebSocket Connections",
  description: "Connect directly from your browser to a compatible WebSocket server, send messages and inspect replies. Connections depend on browser and server security policies.",
  keywords: [
    "websocket client online",
    "websocket tester",
    "ws client browser",
    "websocket debugger",
    "test websocket connection",
    "websocket message viewer",
    "real-time connection tester",
    "websocket api testing",
    "wss client",
    "websocket inspector",
  ],
});

export default function WebSocketClientPage() {
  return <WebSocketClient />;
}

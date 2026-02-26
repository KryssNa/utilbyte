import WebSocketClient from "@/components/tools/dev/WebSocketClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebSocket Client Online Free - Test WebSocket Connections",
  description:
    "Connect to any WebSocket server, send and receive messages in real-time. Debug WebSocket APIs, test real-time connections, and inspect message payloads.",
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
  openGraph: {
    title: "WebSocket Client Online Free - Test Real-Time Connections",
    description:
      "Connect to WebSocket servers, send and receive messages in real-time. Debug and test WebSocket APIs.",
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "/dev-tools/websocket-client",
  },
};

export default function WebSocketClientPage() {
  return <WebSocketClient />;
}

import RequestCatcher from "@/components/tools/dev/RequestCatcher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Catcher Online Free - Capture & Inspect HTTP Requests",
  description:
    "Capture and inspect HTTP requests in real-time. Debug webhooks, test API integrations, and inspect request payloads with headers, body, and query parameters.",
  keywords: [
    "request catcher",
    "http request inspector",
    "webhook debugger",
    "request bin",
    "capture http requests",
    "webhook tester",
    "http debugging tool",
    "api webhook testing",
    "request logger",
    "http request viewer",
  ],
  openGraph: {
    title: "Request Catcher - Capture & Inspect HTTP Requests",
    description:
      "Debug webhooks and test API integrations by capturing HTTP requests in real-time.",
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "/dev-tools/request-catcher",
  },
};

export default function RequestCatcherPage() {
  return <RequestCatcher />;
}

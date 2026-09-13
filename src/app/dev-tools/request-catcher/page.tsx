import { createToolMetadata } from "@/lib/tool-metadata";

import RequestCatcher from "@/components/tools/dev/RequestCatcher";

export const metadata = createToolMetadata("/dev-tools/request-catcher", {
  title: "Request Catcher Online Free - Capture & Inspect HTTP Requests",
  description: "Capture and inspect synthetic webhook requests in hosted bins. View headers, body and query parameters; anyone with the bin ID can read or clear its requests.",
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
});

export default function RequestCatcherPage() {
  return <RequestCatcher />;
}

import { createToolMetadata } from "@/lib/tool-metadata";

import LocalProxy from "@/components/tools/dev/LocalProxy";

export const metadata = createToolMetadata("/dev-tools/local-proxy", {
  title: "Local Proxy - Forward Requests to Localhost",
  description: "Configure hosted webhook forwarding to an operator-approved HTTPS destination using an operator access token. Use synthetic requests and test endpoints.",
  keywords: [
    "local proxy",
    "ngrok alternative",
    "localhost tunnel",
    "forward webhook to localhost",
    "reverse proxy tool",
    "webhook localhost testing",
    "local development proxy",
    "request forwarding",
  ],
});

export default function LocalProxyPage() {
  return <LocalProxy />;
}

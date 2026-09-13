import { createToolMetadata } from "@/lib/tool-metadata";

import LocalProxy from "@/components/tools/dev/LocalProxy";

export const metadata = createToolMetadata("/dev-tools/local-proxy", {
  title: "Local Proxy - Forward Requests to Localhost",
  description: "Configure forwarding for hosted Request Catcher bins to a reachable destination, including a local development tunnel. Use synthetic requests; bins have no owner authentication.",
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

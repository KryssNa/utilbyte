import LocalProxy from "@/components/tools/dev/LocalProxy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Proxy - Forward Requests to Localhost | UtilByte",
  description:
    "Forward public webhook requests to your localhost via ngrok, localtunnel, or cloudflared. Debug integrations directly on your local machine in real-time.",
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
  openGraph: {
    title: "Local Proxy - Forward Requests to Localhost",
    description:
      "Forward webhook requests from a public URL to your localhost. Works with ngrok, localtunnel, and cloudflared.",
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "/dev-tools/local-proxy",
  },
};

export default function LocalProxyPage() {
  return <LocalProxy />;
}

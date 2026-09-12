import { createToolMetadata } from "@/lib/tool-metadata";
import UrlEncoder from "@/components/tools/dev/UrlEncoder";

export const metadata = createToolMetadata("/dev-tools/url-encoder", {
  title: "URL Encoder Decoder Online Free - Encode URLs & Decode URIs",
  description:
    "Encode and decode URLs, URIs, form data, and query strings online for free. Perfect for web developers, API testing, and handling special characters in URLs.",
  keywords: [
    "url encoder decoder online free",
    "encode url online",
    "decode url online",
    "url encoding tool",
    "uri encoder decoder",
    "percent encoding decoder",
    "url encode special characters",
    "form data encoding",
    "query string encoder",
    "web developer url tools",
    "api url encoding",
    "javascript encodeuricomponent"
  ],
});

export default function UrlEncoderPage() {
  return (
    <UrlEncoder />

  );
}

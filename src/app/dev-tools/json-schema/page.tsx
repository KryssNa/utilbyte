import DataWorkflow from "@/components/tools/dev/DataWorkflow";
import type { Metadata } from "next";
const title = "JSON Schema Validator — Draft-07";
const description = "Validate JSON against a draft-07 schema in your browser. No remote schema retrieval, type coercion, or uploaded documents.";
const path = "/dev-tools/json-schema";
export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};
const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `https://utilbyte.app${path}`, applicationCategory: "DeveloperApplication", operatingSystem: "Web Browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
    { "@type": "ListItem", position: 2, name: "Developer Tools", item: "https://utilbyte.app/dev-tools" },
    { "@type": "ListItem", position: 3, name: title, item: `https://utilbyte.app${path}` },
  ] },
];
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><DataWorkflow kind="json-schema" /></>;
}

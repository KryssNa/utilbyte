import { getTool } from "@/lib/tool-catalog";

export default function ToolStructuredData({ href }: { href: string }) {
  const tool = getTool(href);
  if (!tool) return null;
  const origin = "https://utilbyte.app";
  const data = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: tool.title, description: tool.desc,
      url: origin + href, applicationCategory: "UtilitiesApplication", operatingSystem: "Web Browser" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      { "@type": "ListItem", position: 2, name: `${tool.category === "Dev" ? "Developer" : tool.category} Tools`, item: origin + tool.categoryHref },
      { "@type": "ListItem", position: 3, name: tool.title, item: origin + href },
    ] },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

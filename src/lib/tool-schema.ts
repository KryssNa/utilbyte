import type { CatalogTool } from "@/lib/tool-catalog";

export interface ToolSchemaContent {
  tool: CatalogTool;
  title: string;
  description: string;
  categoryLabel: string;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
}

/** These values come from the same props as the visible heading and FAQ. */
export function createToolSchema({ tool, title, description, categoryLabel, faqs }: ToolSchemaContent) {
  const origin = (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");
  const url = `${origin}${tool.href}`;
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebApplication",
      "@id": `${url}#application`,
      name: title,
      description,
      url,
      applicationCategory: tool.category === "Dev" ? "DeveloperApplication" : "UtilitiesApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript and a compatible web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 2, name: categoryLabel, item: `${origin}${tool.categoryHref}` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];
  if (faqs.length) graph.push({
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeToolSchema(content: ToolSchemaContent): string {
  return JSON.stringify(createToolSchema(content)).replace(/</g, "\\u003c");
}

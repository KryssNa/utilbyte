import type { Metadata } from "next";
import { catalog } from "@/lib/tool-catalog";

interface ToolMetadataOptions {
  title: string;
  description: string;
  keywords?: Metadata["keywords"];
}

/** Set page-level social fields explicitly: nested metadata is not deep-merged. */
export function createToolMetadata(path: string, { title, description, keywords }: ToolMetadataOptions): Metadata {
  const origin = (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");
  const url = `${origin}${path}`;
  const tool = catalog.find(item => item.href === path);
  const image = { url: tool ? `${origin}/og/${tool.id}` : `${origin}/social-card.png`, width: 1200, height: 630, alt: tool ? `${tool.title} — ${tool.category === "Dev" ? "Developer" : tool.category} tools by UtilByte` : "UtilByte — Free tools for everyday work" };
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "UtilByte", type: "website", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

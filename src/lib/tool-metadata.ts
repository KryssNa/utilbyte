import { SOCIAL_CARD } from "./social-card";
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
  const image = tool
    ? { url: `${origin}/og/${tool.id}`, width: 1200, height: 630, alt: `${tool.title} — ${tool.category === "Dev" ? "Developer" : tool.category} tools by UtilByte` }
    : { ...SOCIAL_CARD, url: `${origin}${SOCIAL_CARD.url}` };
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "UtilByte", type: "website", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

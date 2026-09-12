import { SOCIAL_CARD } from "./social-card";
import type { Metadata } from "next";

// Nested social metadata replaces the parent's object in Next.js; always supply
// the page identity and image instead of inheriting the homepage's preview.
export function withPageMetadata(route: string, metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : "UtilByte";
  const description = metadata.description ?? "Free tools for everyday work.";
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: route },
    openGraph: {
      type: "website", locale: "en_US", siteName: "UtilByte",
      ...metadata.openGraph,
      title, description, url: `https://utilbyte.app${route === "/" ? "" : route}`,
      images: [SOCIAL_CARD],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image", title, description, images: [SOCIAL_CARD],
    },
  };
}

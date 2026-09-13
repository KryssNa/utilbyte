import { catalog } from "@/lib/tool-catalog";
import { GUIDES } from "@/content/guides";
import { MetadataRoute } from "next";

const staticRoutes: Array<{
  path: string;
  lastModified?: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/ai", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/guides", changeFrequency: "weekly", priority: 0.7 },
  { path: "/dev-tools", changeFrequency: "monthly", priority: 0.85 },
  { path: "/image-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/pdf-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/text-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/utility-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/video-tools", changeFrequency: "monthly", priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");

  const toolRoutes = catalog.map(tool => ({
    path: tool.href, changeFrequency: "monthly" as const, priority: 0.8,
    lastModified: tool.contentUpdatedAt,
  }));

  const guideRoutes = GUIDES.map((guide) => ({
    path: `/guides/${guide.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: guide.updated || guide.published,
  }));

  return [...staticRoutes, ...toolRoutes, ...guideRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

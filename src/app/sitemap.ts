import { toolCategories } from "@/components/layout/navbar/data";
import { MetadataRoute } from "next";

const staticRoutes: Array<{
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/dev-tools", changeFrequency: "monthly", priority: 0.85 },
  { path: "/image-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/pdf-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/text-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/utility-tools", changeFrequency: "monthly", priority: 0.75 },
  { path: "/video-tools", changeFrequency: "monthly", priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");
  const now = new Date();

  const toolRoutes = toolCategories.flatMap((category) =>
    category.tools.map((tool) => ({
      path: tool.href,
      changeFrequency: "monthly" as const,
      priority: category.title === "Dev" ? 0.85 : 0.8,
    }))
  );

  return [...staticRoutes, ...toolRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

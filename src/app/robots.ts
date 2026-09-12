import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").replace(/\/$/, "");

  return {
    rules: [
      {
        // The wildcard already permits search crawlers. A bot-specific Allow
        // group would need these same exclusions; groups do not inherit them.
        // Keep AI-training access governed by the existing wildcard policy.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

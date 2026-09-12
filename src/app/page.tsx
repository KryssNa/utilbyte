import { SOCIAL_CARD } from "@/lib/social-card";
import { allTools } from "@/components/layout/navbar/data";
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "UtilByte - Free Online Tools for Images, PDFs & Developers",
  description:
    "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
  keywords: [
    "free online tools",
    "image compressor",
    "pdf merger",
    "json formatter",
    "text tools",
    "developer tools",
    "online utilities",
    "privacy first tools",
    "no upload tools",
    "browser based tools",
    "free image tools",
    "free pdf tools",
    "free text tools",
    "free developer tools"
  ],
  openGraph: {
    title: "UtilByte - Free Online Tools for Everyday Work",
    description: "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
    type: "website",
    locale: "en_US",
    url: "https://utilbyte.app",
    siteName: "UtilByte",
    images: [SOCIAL_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilByte - Free Online Tools",
    description: "Free image, PDF, text and developer tools. No sign-up. Local file processing and clearly labeled network tools, with data-handling details on each tool.",
    images: [SOCIAL_CARD],
  },
  alternates: {
    canonical: "https://utilbyte.app",
  }
};


// Describe visible content using the same catalog as the directory and sitemap.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "UtilByte - Free Online Tools for Everyday Work",
    description: metadata.description,
    url: "https://utilbyte.app",
    isPartOf: { "@id": "https://utilbyte.app/#website" },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UtilByte tool directory",
    numberOfItems: allTools.length,
    itemListElement: allTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `https://utilbyte.app${tool.href}`,
    })),
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  );
}

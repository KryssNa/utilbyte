import { allTools } from "@/components/layout/navbar/data";
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "UtilByte - Free Online Tools for Images, PDFs & Developers",
  description:
    "Free online tools for images, PDFs, text and developers. No login. File tools run entirely in your browser, so your files are never uploaded.",
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
    description: "Free image, PDF, text & developer tools. No sign-up. No uploads. Everything runs in your browser.",
    type: "website",
    locale: "en_US",
    url: "https://utilbyte.app",
    siteName: "UtilByte",
    images: [
      {
        url: "https://utilbyte.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UtilByte - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilByte - Free Online Tools",
    description: "Free online tools that respect your privacy. Your files are processed in your browser, not uploaded.",
    images: ["https://utilbyte.app/images/og-image.jpg"],
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
    isPartOf: { "@type": "WebSite", name: "UtilByte", url: "https://utilbyte.app" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UtilByte",
    url: "https://utilbyte.app",
    logo: "https://utilbyte.app/logo.svg",
    sameAs: ["https://github.com/KryssNa/utilbyte"],
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

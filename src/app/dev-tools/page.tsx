import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Tools - Free Online Dev Utilities",
  description:
    "Use free browser-based developer tools including JSON Formatter, Base64 Encoder, JWT Decoder, Regex Tester, API Client, UUID Generator, and more.",
  keywords: [
    "developer tools online",
    "free dev tools",
    "json formatter",
    "base64 encoder",
    "jwt decoder",
    "regex tester",
    "api client",
    "uuid generator",
  ],
  alternates: {
    canonical: "/dev-tools",
  },
  openGraph: {
    title: "Developer Tools - Free Online Dev Utilities",
    description:
      "17 privacy-first developer tools that run in your browser. No sign-up and no file uploads required.",
    type: "website",
    url: "https://utilbyte.app/dev-tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools - UtilByte",
    description:
      "Free browser-based dev utilities for JSON, Base64, JWT, Regex, SQL, and API workflows.",
  },
};

export default function DevToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="Dev"
      badgeLabel="Developer Tools"
      heading="All Developer Tools"
      description="Utilities built for daily developer workflows. Everything runs client-side for speed and privacy."
      accentClassName="border-amber-500/30 bg-amber-500/10 text-amber-400"
    />
  );
}

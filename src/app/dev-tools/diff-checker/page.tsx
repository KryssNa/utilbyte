import DiffChecker from "@/components/tools/dev/DiffChecker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diff Checker - Compare Text and Code Online Free",
  description:
    "Compare two text files or code snippets online for free. See differences side by side with highlighted changes. Perfect for code reviews and debugging.",
  keywords: [
    "diff checker",
    "text comparison",
    "compare text online",
    "code diff",
    "file comparison",
    "text diff tool",
    "compare code",
    "diff tool",
    "text compare",
    "code comparison"
  ],
  openGraph: {
    title: "Diff Checker - Compare Text and Code Online Free",
    description:
      "Compare two text files or code snippets online for free. See differences side by side with highlighted changes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diff Checker - Compare Text Online Free",
    description:
      "Compare text and code snippets side by side with highlighted changes. Free, private, browser-based.",
  },
  alternates: {
    canonical: "/dev-tools/diff-checker",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Diff Checker Online Free",
    description:
      "Compare two text files or code snippets online for free. See differences side by side with highlighted changes.",
    url: "https://utilbyte.app/dev-tools/diff-checker",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Side-by-side text comparison",
      "Syntax highlighting",
      "Inline and unified diff views",
      "Code review support",
      "Free and private",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
      { "@type": "ListItem", position: 2, name: "Developer Tools", item: "https://utilbyte.app/dev-tools" },
      { "@type": "ListItem", position: 3, name: "Diff Checker", item: "https://utilbyte.app/dev-tools/diff-checker" },
    ],
  },
];

export default function DiffCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DiffChecker />
    </>
  );
}

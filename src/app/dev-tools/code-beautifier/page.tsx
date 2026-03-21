import CodeBeautifier from "@/components/tools/dev/CodeBeautifier";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Beautifier - Format HTML, CSS, JavaScript Online Free",
  description:
    "Beautify and format HTML, CSS, and JavaScript code online for free. Make your code clean and readable with proper indentation and formatting.",
  keywords: [
    "code beautifier",
    "html formatter",
    "css formatter",
    "javascript formatter",
    "beautify code online",
    "code formatter",
    "format html",
    "format css",
    "format javascript",
    "code pretty print"
  ],
  openGraph: {
    title: "Code Beautifier - Format HTML, CSS, JavaScript Online Free",
    description:
      "Beautify and format HTML, CSS, and JavaScript code online for free. Proper indentation and formatting.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Beautifier - Format Code Online Free",
    description:
      "Beautify HTML, CSS, and JavaScript code online. Clean formatting with proper indentation. Free and private.",
  },
  alternates: {
    canonical: "/dev-tools/code-beautifier",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Code Beautifier Online Free",
    description:
      "Beautify and format HTML, CSS, and JavaScript code online for free with proper indentation.",
    url: "https://utilbyte.app/dev-tools/code-beautifier",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "HTML formatting",
      "CSS beautification",
      "JavaScript formatting",
      "Proper indentation",
      "Syntax highlighting",
      "Free and private",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
      { "@type": "ListItem", position: 2, name: "Developer Tools", item: "https://utilbyte.app/dev-tools" },
      { "@type": "ListItem", position: 3, name: "Code Beautifier", item: "https://utilbyte.app/dev-tools/code-beautifier" },
    ],
  },
];

export default function CodeBeautifierPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeBeautifier />
    </>
  );
}

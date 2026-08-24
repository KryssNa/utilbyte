import CaseConverter from "@/components/tools/text/CaseConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter Online Free - Uppercase Lowercase Title Case Converter",
  description:
    "Convert text case online for free. Transform to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case. Perfect for programming and writing.",
  keywords: [
    "case converter online free",
    "text case converter",
    "uppercase lowercase converter",
    "title case converter online",
    "camelcase converter",
    "pascalcase converter",
    "snake_case converter",
    "kebab-case converter",
    "text case transformation",
    "programming case converter",
    "css case converter",
    "javascript case converter"
  ],
  openGraph: {
    title: "Case Converter Online Free - Text Case Styles",
    description: "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case online for free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Converter Online Free - Text Case",
    description: "Convert text case online for free. Uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case.",
  },
  alternates: {
    canonical: "/text-tools/case-converter",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Case Converter Online Free",
        "description": "Convert text case online for free. Transform to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case. Perfect for programming and writing.",
        "url": "https://utilbyte.app/text-tools/case-converter",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple case conversions",
          "Programming case styles",
          "Real-time preview",
          "Batch processing",
          "Copy to clipboard",
          "Character counting"
        ],
        "screenshot": "https://utilbyte.app/images/case-converter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What case conversion options are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Convert to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and more."
            }
          },
          {
            "@type": "Question",
            "name": "Which case styles are for programming?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "camelCase (JavaScript variables), PascalCase (C# classes), snake_case (Python variables), kebab-case (CSS classes)."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert large blocks of text?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can convert text of any length. The tool processes your text instantly and maintains formatting."
            }
          }
        ]
      }
    ];

export default function CaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseConverter />
    </>
  );
}

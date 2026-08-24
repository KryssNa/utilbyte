import TextFormatter from "@/components/tools/text/TextFormatter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Formatter Online Free - Format JSON XML SQL CSS JavaScript Code",
  description:
    "Format and beautify code online for free. Supports JSON, XML, SQL, CSS, JavaScript, TypeScript formatting with syntax highlighting and validation. Perfect for developers.",
  keywords: [
    "text formatter online free",
    "code formatter online",
    "json formatter online",
    "xml formatter online",
    "sql formatter online",
    "css formatter online",
    "javascript formatter online",
    "code beautifier",
    "pretty print code",
    "syntax highlighter",
    "code validator online",
    "typescript formatter",
    "html formatter online",
    "developer code tools"
  ],
  openGraph: {
    title: "Text Formatter Online Free - Code Formatter",
    description: "Format and beautify JSON, XML, SQL, CSS, JavaScript code online for free. Syntax highlighting and validation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Formatter Online Free - Code Beautifier",
    description: "Format JSON, XML, SQL, CSS, JavaScript code online for free. Perfect for developers and code review.",
  },
  alternates: {
    canonical: "/text-tools/text-formatter",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Text Formatter Online Free",
        "description": "Format and beautify code online for free. Supports JSON, XML, SQL, CSS, JavaScript, TypeScript formatting with syntax highlighting and validation. Perfect for developers.",
        "url": "https://utilbyte.app/text-tools/text-formatter",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple language support",
          "Syntax highlighting",
          "Code beautification",
          "Minification options",
          "Validation and error checking",
          "Developer-friendly formatting"
        ],
        "screenshot": "https://utilbyte.app/images/text-formatter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What programming languages are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Supports JSON, XML, SQL, CSS, JavaScript, TypeScript, and other popular programming languages with proper syntax highlighting and formatting."
            }
          },
          {
            "@type": "Question",
            "name": "Can I both format and minify code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can switch between beautified (readable) and minified (compressed) versions of your code for different use cases."
            }
          },
          {
            "@type": "Question",
            "name": "Does it validate syntax errors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the formatter includes syntax validation and will highlight errors in your code to help you identify and fix issues."
            }
          }
        ]
      }
    ];

export default function TextFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextFormatter />
    </>
  );
}

import RegexTester from "@/components/tools/dev/RegexTester";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester Online Free - Test Regular Expressions Live",
  description:
    "Test and debug regular expressions online for free. Live matching, highlighting, capture groups, replacement testing. Supports PCRE, JavaScript, Python regex flavors.",
  keywords: [
    "regex tester online free",
    "regular expression tester",
    "test regex pattern",
    "regex validator online",
    "regex debugger",
    "regex pattern matching",
    "regular expressions tester",
    "regex flags tester",
    "regex replace tester",
    "javascript regex tester",
    "pcre regex tester",
    "python regex tester"
  ],
  openGraph: {
    title: "Regex Tester Online Free - Test Regular Expressions",
    description: "Test and debug regex patterns online for free. Live matching, highlighting, capture groups, and replacement testing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester Online Free - Pattern Testing",
    description: "Test regex patterns online for free. Live matching, highlighting, capture groups, supports multiple regex flavors.",
  },
  alternates: {
    canonical: "/dev-tools/regex-tester",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Regex Tester Online Free",
        "description": "Test and debug regular expressions online for free. Live matching, highlighting, capture groups, replacement testing. Supports PCRE, JavaScript, Python regex flavors.",
        "url": "https://utilbyte.app/dev-tools/regex-tester",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Live regex testing",
          "Pattern highlighting",
          "Capture group extraction",
          "Replacement testing",
          "Multiple regex flavors",
          "Real-time validation"
        ],
        "screenshot": "https://utilbyte.app/images/regex-tester-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What regex flavors are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support PCRE (Perl Compatible Regular Expressions), JavaScript, and Python regex flavors with their respective syntax and features."
            }
          },
          {
            "@type": "Question",
            "name": "How do I test a regex pattern?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enter your regex pattern and test string. The tool will highlight matches, show capture groups, and provide real-time feedback on pattern validity."
            }
          },
          {
            "@type": "Question",
            "name": "What are capture groups?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Capture groups allow you to extract specific parts of a match. Use parentheses () to create groups that can be referenced in replacements or extractions."
            }
          },
          {
            "@type": "Question",
            "name": "Can I test replacement patterns?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can test both matching and replacement patterns. Enter a replacement string to see how your regex transforms the matched text."
            }
          }
        ]
      }
    ])
  }
};

export default function RegexTesterPage() {
  return <RegexTester />;
}

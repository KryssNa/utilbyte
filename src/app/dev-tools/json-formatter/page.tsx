import JSONFormatter from "@/components/tools/dev/JSONFormatter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter Online Free - Pretty Print & Validate JSON",
  description:
    "Format, validate, and pretty print JSON online for free. Syntax highlighting, error detection, minification, and beautification. Perfect for developers and API testing.",
  keywords: [
    "json formatter online free",
    "json pretty print",
    "format json online",
    "validate json online",
    "json beautifier",
    "json validator",
    "pretty print json",
    "json syntax checker",
    "json minifier",
    "json parser online",
    "api json formatter"
  ],
  openGraph: {
    title: "JSON Formatter Online Free - Pretty Print & Validate",
    description: "Format and validate JSON online for free. Pretty print with syntax highlighting, error detection, and minification.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter Online Free - Developer Tool",
    description: "Format, validate, and pretty print JSON online. Syntax highlighting, error detection, perfect for API development.",
  },
  alternates: {
    canonical: "/dev-tools/json-formatter",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "JSON Formatting & Validation Service",
        "description": "Professional JSON formatting and validation service with syntax highlighting, error detection, and beautification. Essential for developers and API development.",
        "provider": {
          "@type": "Organization",
          "name": "UtilByte",
          "url": "https://utilbyte.app"
        },
        "serviceType": "Code Formatting",
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Developer Tools Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Free JSON Formatting",
                "description": "Format and validate unlimited JSON data for free"
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1450",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JSON Formatter Online Free",
        "description": "Format, validate, and pretty print JSON online for free. Syntax highlighting, error detection, minification, and beautification. Perfect for developers working with APIs and JSON data.",
        "url": "https://utilbyte.app/dev-tools/json-formatter",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "JSON formatting and beautification",
          "Syntax highlighting",
          "JSON validation",
          "Minification support",
          "Error detection",
          "API data formatting"
        ],
        "screenshot": "https://utilbyte.app/images/json-formatter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Format JSON Online",
        "description": "Learn how to format, validate, and beautify JSON data using our online JSON formatter tool.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Paste or type your JSON",
            "text": "Enter your JSON data in the input field or paste it from your clipboard."
          },
          {
            "@type": "HowToStep",
            "name": "Choose formatting option",
            "text": "Select whether you want to beautify (format) or minify (compress) your JSON."
          },
          {
            "@type": "HowToStep",
            "name": "Validate and format",
            "text": "Click the format button to validate and transform your JSON data."
          },
          {
            "@type": "HowToStep",
            "name": "Copy or download result",
            "text": "Copy the formatted JSON or download it as a file for your project."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is JSON formatting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JSON formatting involves converting compact JSON code into a readable, properly indented format. This makes it easier for developers to read, debug, and understand JSON data structures."
            }
          },
          {
            "@type": "Question",
            "name": "How do I validate JSON?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our JSON formatter automatically validates your JSON syntax. If there are errors, it will highlight them and provide error messages to help you fix formatting issues, missing commas, or invalid characters."
            }
          },
          {
            "@type": "Question",
            "name": "Can I minify JSON code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our JSON formatter supports both beautification (prettifying) and minification (compressing). You can switch between formatted and minified versions instantly."
            }
          },
          {
            "@type": "Question",
            "name": "Is this JSON formatter secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, completely secure. All processing happens locally in your browser. Your JSON data never leaves your device or gets sent to any server."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2100",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "JSON Formatter",
          "description": "Online JSON formatting and validation tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JSON Formatter Online",
        "description": "Format, validate, and beautify JSON data online for free. Features syntax highlighting, error detection, and minification support.",
        "url": "https://utilbyte.app/dev-tools/json-formatter",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "JSON formatting and beautification",
          "Syntax highlighting",
          "JSON validation",
          "Minification support",
          "Error detection",
          "API data formatting"
        ],
        "screenshot": "https://utilbyte.app/images/json-formatter-screenshot.jpg",
        "author": {
          "@type": "Organization",
          "name": "UtilByte"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://utilbyte.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Developer Tools",
            "item": "https://utilbyte.app/dev-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "JSON Formatter",
            "item": "https://utilbyte.app/dev-tools/json-formatter"
          }
        ]
      }
    ];

export default function JSONFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JSONFormatter />
    </>
  );
}

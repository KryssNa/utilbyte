import UrlEncoder from "@/components/tools/dev/UrlEncoder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder Decoder Online Free - Encode URLs & Decode URIs",
  description:
    "Encode and decode URLs, URIs, form data, and query strings online for free. Perfect for web developers, API testing, and handling special characters in URLs.",
  keywords: [
    "url encoder decoder online free",
    "encode url online",
    "decode url online",
    "url encoding tool",
    "uri encoder decoder",
    "percent encoding decoder",
    "url encode special characters",
    "form data encoding",
    "query string encoder",
    "web developer url tools",
    "api url encoding",
    "javascript encodeuricomponent"
  ],
  openGraph: {
    title: "URL Encoder Decoder Online Free - Encode URLs",
    description: "Encode and decode URLs, URIs, form data online for free. Essential tool for web developers and API testing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder Decoder Online Free",
    description: "Encode and decode URLs online for free. Handle special characters, form data, perfect for web development.",
  },
  alternates: {
    canonical: "/dev-tools/url-encoder",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "URL Encoder Decoder Online Free",
        "description": "Encode and decode URLs, URIs, form data, and query strings online for free. Perfect for web developers, API testing, and handling special characters in URLs.",
        "url": "https://utilbyte.app/dev-tools/url-encoder",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "URL encoding and decoding",
          "URI component handling",
          "Form data encoding",
          "Query string processing",
          "Special character handling",
          "Web development tools"
        ],
        "screenshot": "https://utilbyte.app/images/url-encoder-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "When should I URL encode data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URL encode data when sending special characters in URLs, form submissions, or API requests to ensure proper transmission and parsing."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between encodeURI and encodeURIComponent?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "encodeURI is for encoding entire URLs, while encodeURIComponent is for encoding URL components and query parameters."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to decode URLs to read them?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URL decoding makes encoded URLs human-readable but encoded URLs work fine in browsers. Decode only when you need to process or display the data."
            }
          }
        ]
      }
    ])
  }
};

export default function UrlEncoderPage() {
  return <UrlEncoder />;
}

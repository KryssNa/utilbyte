import Base64Tool from "@/components/tools/dev/Base64Tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder Decoder Online Free - Encode Decode Base64 Text",
  description:
    "Encode and decode Base64 online for free. Convert text, files, and images to Base64 and vice versa. Perfect for developers, API testing, and data encoding.",
  keywords: [
    "base64 encoder decoder online free",
    "encode base64 online",
    "decode base64 online",
    "base64 converter",
    "text to base64",
    "base64 to text",
    "base64 encoder",
    "base64 decoder",
    "online base64 tool",
    "base64 encode decode",
    "base64 string converter"
  ],
  openGraph: {
    title: "Base64 Encoder Decoder Online Free",
    description: "Encode and decode Base64 online for free. Convert text, files, and images to Base64. Perfect for developers and API testing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder Decoder Online Free",
    description: "Encode and decode Base64 online. Convert text and files to Base64 instantly. Free developer tool.",
  },
  alternates: {
    canonical: "/dev-tools/base64",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Base64 Encoder Decoder Online Free",
        "description": "Encode and decode Base64 online for free. Convert text, files, and images to Base64 and vice versa. Perfect for developers, API testing, and data encoding.",
        "url": "https://utilbyte.app/dev-tools/base64",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Base64 encoding and decoding",
          "File and image support",
          "URL-safe encoding",
          "Real-time processing",
          "Developer-friendly interface"
        ],
        "screenshot": "https://utilbyte.app/images/base64-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Base64 encoding used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Base64 encoding is commonly used to encode binary data (like images, files) into text format for transmission over text-based protocols like HTTP, email, and APIs."
            }
          },
          {
            "@type": "Question",
            "name": "Can I encode files and images?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload files and images to encode them to Base64 format. The tool supports various file types and provides the encoded output."
            }
          },
          {
            "@type": "Question",
            "name": "Is there URL-safe Base64 encoding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the tool provides both standard Base64 and URL-safe Base64 encoding options for different use cases."
            }
          },
          {
            "@type": "Question",
            "name": "Is Base64 encoding secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Base64 is an encoding format, not encryption. It's easily reversible and should not be used for security purposes."
            }
          }
        ]
      }
    ];

export default function Base64ToolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Base64Tool />
    </>
  );
}

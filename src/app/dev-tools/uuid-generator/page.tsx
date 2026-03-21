import UUIDGenerator from "@/components/tools/dev/UUIDGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator Online Free - Generate UUID v4 Instantly",
  description:
    "Generate UUIDs online for free. Create RFC 4122 compliant UUID v4 unique identifiers instantly. Perfect for database keys, API tokens, and application development.",
  keywords: [
    "uuid generator online free",
    "generate uuid v4",
    "uuid creator online",
    "unique identifier generator",
    "guid generator",
    "random uuid online",
    "uuid4 generator",
    "rfc 4122 uuid",
    "database primary key generator",
    "api token generator",
    "unique id generator online"
  ],
  openGraph: {
    title: "UUID Generator Online Free - Generate v4 UUIDs",
    description: "Generate RFC 4122 compliant UUID v4 unique identifiers online for free. Perfect for database keys and API development.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator Online Free - v4 UUIDs",
    description: "Generate UUID v4 unique identifiers online for free. RFC 4122 compliant, perfect for database keys and APIs.",
  },
  alternates: {
    canonical: "/dev-tools/uuid-generator",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UUID Generator Online Free",
        "description": "Generate UUIDs online for free. Create RFC 4122 compliant UUID v4 unique identifiers instantly. Perfect for database keys, API tokens, and application development.",
        "url": "https://utilbyte.app/dev-tools/uuid-generator",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "RFC 4122 compliant UUID v4",
          "Cryptographically secure generation",
          "Multiple UUID formats",
          "Batch generation",
          "Developer-friendly output"
        ],
        "screenshot": "https://utilbyte.app/images/uuid-generator-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a UUID?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems. UUID v4 generates random UUIDs."
            }
          },
          {
            "@type": "Question",
            "name": "Are generated UUIDs truly unique?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UUID v4 uses cryptographically secure random number generation, making collisions extremely unlikely (probability of collision is negligible)."
            }
          },
          {
            "@type": "Question",
            "name": "What are UUIDs used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UUIDs are commonly used as primary keys in databases, API tokens, session identifiers, and anywhere you need guaranteed uniqueness."
            }
          }
        ]
      }
    ];

export default function UUIDGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UUIDGenerator />
    </>
  );
}

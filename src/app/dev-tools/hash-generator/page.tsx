import HashGenerator from "@/components/tools/dev/HashGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator Online Free - MD5 SHA-256 SHA-512 Hash Calculator",
  description:
    "Generate cryptographic hashes online for free. Supports MD5, SHA-1, SHA-256, SHA-384, SHA-512, and more. Perfect for password hashing, file integrity, and security.",
  keywords: [
    "hash generator online free",
    "md5 hash generator",
    "sha256 hash generator",
    "sha512 hash generator",
    "cryptographic hash calculator",
    "password hash online",
    "file hash calculator",
    "md5 checksum",
    "sha256 checksum",
    "hash function online",
    "online hash tool",
    "generate hash from text"
  ],
  openGraph: {
    title: "Hash Generator Online Free - MD5 SHA-256 SHA-512",
    description: "Generate cryptographic hashes online for free. MD5, SHA-256, SHA-512, perfect for security and file integrity.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator Online Free - Cryptographic Hashes",
    description: "Generate MD5, SHA-256, SHA-512 hashes online for free. Perfect for password hashing and file integrity verification.",
  },
  alternates: {
    canonical: "/dev-tools/hash-generator",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Hash Generator Online Free",
        "description": "Generate cryptographic hashes online for free. Supports MD5, SHA-1, SHA-256, SHA-384, SHA-512, and more. Perfect for password hashing and file integrity.",
        "url": "https://utilbyte.app/dev-tools/hash-generator",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple hash algorithms",
          "Cryptographic security",
          "File and text hashing",
          "Password security",
          "Data integrity verification"
        ],
        "screenshot": "https://utilbyte.app/images/hash-generator-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What hash algorithms are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support MD5, SHA-1, SHA-256, SHA-384, SHA-512, and other common cryptographic hash algorithms."
            }
          },
          {
            "@type": "Question",
            "name": "Is MD5 secure for passwords?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MD5 is not recommended for password hashing due to security vulnerabilities. Use SHA-256 or stronger algorithms for password security."
            }
          },
          {
            "@type": "Question",
            "name": "Can I hash files?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload files to generate hash values for data integrity verification and digital signatures."
            }
          },
          {
            "@type": "Question",
            "name": "What are hash functions used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hash functions are used for password storage, file integrity checking, digital signatures, and blockchain technology."
            }
          }
        ]
      }
    ];

export default function HashGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HashGenerator />
    </>
  );
}

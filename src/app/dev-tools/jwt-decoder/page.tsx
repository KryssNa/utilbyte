import JwtDecoder from "@/components/tools/dev/JwtDecoder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder Online Free - Decode JSON Web Tokens Instantly",
  description:
    "Decode and inspect JWT tokens online for free. View header, payload, signature with expiration validation. Perfect for API debugging and authentication testing.",
  keywords: [
    "jwt decoder online free",
    "json web token decoder",
    "decode jwt token",
    "jwt inspector online",
    "jwt validator",
    "jwt token analyzer",
    "jwt header decoder",
    "jwt payload decoder",
    "jwt signature verification",
    "authentication token decoder",
    "api jwt debugger",
    "oauth token inspector"
  ],
  openGraph: {
    title: "JWT Decoder Online Free - Decode JSON Web Tokens",
    description: "Decode and inspect JWT tokens online for free. View header, payload, signature with expiration validation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder Online Free - Token Inspector",
    description: "Decode JWT tokens online for free. Inspect header, payload, signature, and validate expiration for API debugging.",
  },
  alternates: {
    canonical: "/dev-tools/jwt-decoder",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JWT Decoder Online Free",
        "description": "Decode and inspect JWT tokens online for free. View header, payload, signature with expiration validation. Perfect for API debugging and authentication testing.",
        "url": "https://utilbyte.app/dev-tools/jwt-decoder",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "JWT token decoding",
          "Header inspection",
          "Payload viewing",
          "Signature validation",
          "Expiration checking",
          "API debugging"
        ],
        "screenshot": "https://utilbyte.app/images/jwt-decoder-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a JWT token?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and information exchange."
            }
          },
          {
            "@type": "Question",
            "name": "How do I decode a JWT token?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply paste your JWT token into the input field. The tool will automatically decode and display the header, payload, and verify the signature."
            }
          },
          {
            "@type": "Question",
            "name": "Can I verify JWT signatures?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the tool can verify JWT signatures using the provided secret key to ensure token integrity and authenticity."
            }
          },
          {
            "@type": "Question",
            "name": "What information does a JWT contain?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A JWT consists of three parts: Header (algorithm and token type), Payload (claims and data), and Signature (for verification)."
            }
          }
        ]
      }
    ])
  }
};

export default function JwtDecoderPage() {
  return <JwtDecoder />;
}

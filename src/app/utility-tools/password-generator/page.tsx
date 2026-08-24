import PasswordGenerator from "@/components/tools/utility/PasswordGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator Online Free - Generate Strong Secure Passwords",
  description:
    "Generate strong, secure passwords online for free. Customize length, character types, exclude similar characters. Perfect for accounts, WiFi, and security.",
  keywords: [
    "password generator online free",
    "generate strong password",
    "secure password creator",
    "random password generator",
    "password strength checker",
    "wifi password generator",
    "account password maker",
    "secure password tool",
    "password complexity generator",
    "online password creator",
    "strong password generator",
    "password security tool"
  ],
  openGraph: {
    title: "Password Generator Online Free - Strong Passwords",
    description: "Generate strong, secure passwords online for free. Customize length and character types for maximum security.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator Online Free - Security Tool",
    description: "Generate strong, secure passwords online for free. Perfect for accounts, WiFi, and online security.",
  },
  alternates: {
    canonical: "/utility-tools/password-generator",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Password Generator Online Free",
        "description": "Generate strong, secure passwords online for free. Customize length, character types, exclude similar characters. Perfect for accounts, WiFi, and security.",
        "url": "https://utilbyte.app/utility-tools/password-generator",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Customizable password length",
          "Multiple character types",
          "Exclude similar characters",
          "Password strength indicator",
          "One-click generation"
        ],
        "screenshot": "https://utilbyte.app/images/password-generator-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How secure are the generated passwords?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Passwords are generated using cryptographically secure random number generation, ensuring maximum security and unpredictability."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize password requirements?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can customize password length (8-128 characters), include/exclude uppercase letters, lowercase letters, numbers, and special characters."
            }
          },
          {
            "@type": "Question",
            "name": "Is my password history stored?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, passwords are generated locally in your browser and are never stored or transmitted to any server. Complete privacy guaranteed."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Generate Secure Passwords",
        "description": "Learn how to create strong, secure passwords using our online password generator tool.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Set password length",
            "text": "Choose the desired password length (recommended: 12-16 characters for maximum security)."
          },
          {
            "@type": "HowToStep",
            "name": "Select character types",
            "text": "Choose to include uppercase letters, lowercase letters, numbers, and special characters."
          },
          {
            "@type": "HowToStep",
            "name": "Generate password",
            "text": "Click the generate button to create a strong, random password."
          },
          {
            "@type": "HowToStep",
            "name": "Copy and use",
            "text": "Copy the generated password and use it for your accounts. Never reuse passwords across different services."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1800",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "Password Generator",
          "description": "Secure online password generator tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Password Generator Online",
        "description": "Generate strong, secure passwords online for free. Create custom-length passwords with various character combinations for maximum security.",
        "url": "https://utilbyte.app/utility-tools/password-generator",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom password length",
          "Multiple character types",
          "Strength indicators",
          "Copy to clipboard",
          "No password storage",
          "Local generation"
        ],
        "screenshot": "https://utilbyte.app/images/password-generator-screenshot.jpg",
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
            "name": "Utility Tools",
            "item": "https://utilbyte.app/utility-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Password Generator",
            "item": "https://utilbyte.app/utility-tools/password-generator"
          }
        ]
      }
    ])
  }
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}

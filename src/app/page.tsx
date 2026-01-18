import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

// Fix: "other" should be an object, not an array of object(s) and string key
export const metadata: Metadata = {
  title: "UtilByte - Free Online Tools for Everyday Work",
  description:
    "Free online tools for images, PDFs, text & code. No login, no uploads. 100% browser-based for complete privacy.",
  keywords: [
    "free online tools",
    "image compressor",
    "pdf merger",
    "json formatter",
    "text tools",
    "developer tools",
    "online utilities",
    "privacy first tools",
    "no upload tools",
    "browser based tools",
    "free image tools",
    "free pdf tools",
    "free text tools",
    "free developer tools"
  ],
  openGraph: {
    title: "UtilByte - Free Online Tools for Everyday Work",
    description: "Free image, PDF, text & developer tools. No sign-up. No uploads. Everything runs in your browser.",
    type: "website",
    locale: "en_US",
    url: "https://utilbyte.app",
    siteName: "UtilByte",
    images: [
      {
        url: "https://utilbyte.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UtilByte - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilByte - Free Online Tools",
    description: "Free online tools that respect your privacy. No uploads, no tracking.",
    images: ["https://utilbyte.app/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://utilbyte.app",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "UtilByte - Free Online Tools for Everyday Work",
        "description": "Free online tools for images, PDFs, text & code. No login, no uploads. 100% browser-based for complete privacy.",
        "url": "https://utilbyte.app",
        "isPartOf": {
          "@type": "WebSite",
          "name": "UtilByte",
          "url": "https://utilbyte.app"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://utilbyte.app/images/og-image.jpg"
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-01"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "UtilByte",
        "url": "https://utilbyte.app",
        "logo": "https://utilbyte.app/logo.svg",
        "description": "Free online tools for image, PDF, text, and developer work. Privacy-first, no uploads required.",
        "foundingDate": "2024",
        "sameAs": [
          "https://github.com/utilbyte"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "English"
        },
        "offers": {
          "@type": "Offer",
          "category": "Software",
          "description": "Free online utility tools"
        },
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "author": {
          "@type": "Organization",
          "name": "UtilByte"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Online Tools Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Image Tools",
                "description": "Compress, resize, convert, and edit images online"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "PDF Tools",
                "description": "Merge, split, compress, and convert PDF files"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Developer Tools",
                "description": "JSON, Base64, UUID, and development utilities"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Text Tools",
                "description": "Format, convert, and process text online"
              }
            }
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "UtilByte - Free Online Tools",
        "url": "https://utilbyte.app",
        "description": "Free online tools for image, PDF, text, and developer work. No sign-up required.",
        "publisher": {
          "@type": "Organization",
          "name": "UtilByte"
        },
        "mainEntity": [
          {
            "@type": "SiteNavigationElement",
            "name": "Image Tools",
            "url": "https://utilbyte.app/#image-tools"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "PDF Tools",
            "url": "https://utilbyte.app/#pdf-tools"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Developer Tools",
            "url": "https://utilbyte.app/#dev-tools"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are UtilByte tools really free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all UtilByte tools are completely free to use. No hidden fees, no premium features, no sign-up required. Everything runs in your browser with zero cost."
            }
          },
          {
            "@type": "Question",
            "name": "Do you store my files or data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, all processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security. We don't store, track, or transmit your data."
            }
          },
          {
            "@type": "Question",
            "name": "What browsers are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UtilByte works on all modern browsers including Chrome, Firefox, Safari, and Edge. No downloads or plugins required. Compatible with desktop and mobile devices."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a file size limit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "File size limits depend on your browser and device capabilities. For large files, ensure you have sufficient RAM available. Processing happens locally in your browser."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use UtilByte offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UtilByte requires an internet connection for the initial page load, but all processing happens locally in your browser. Once loaded, many tools work offline."
            }
          },
          {
            "@type": "Question",
            "name": "How secure are your tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Extremely secure. All tools run locally in your browser using modern web technologies. No server uploads, no data transmission, enterprise-grade security headers."
            }
          },
          {
            "@type": "Question",
            "name": "What tools do you offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer 38+ tools across categories: Image tools (compress, resize, convert), PDF tools (merge, split, compress), Developer tools (JSON formatter, encoders), Text tools, Utility tools (QR codes, passwords), and Video tools."
            }
          },
          {
            "@type": "Question",
            "name": "Why choose UtilByte over other tool websites?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Privacy-first approach (no uploads), lightning-fast performance, comprehensive tool coverage (38+ tools), free forever, no sign-up required, and works perfectly on all devices."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use Online Tools Safely and Effectively",
        "description": "Complete guide to using online tools safely while protecting your privacy and maximizing productivity.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Choose privacy-first tools",
            "text": "Select tools that process data locally in your browser, like UtilByte, to ensure your files never leave your device."
          },
          {
            "@type": "HowToStep",
            "name": "Check security features",
            "text": "Look for HTTPS encryption, no-upload policies, and transparent privacy statements."
          },
          {
            "@type": "HowToStep",
            "name": "Test with sample data first",
            "text": "Always test tools with sample data before processing sensitive files to ensure they work as expected."
          },
          {
            "@type": "HowToStep",
            "name": "Use modern browsers",
            "text": "Ensure you're using up-to-date browsers like Chrome, Firefox, or Safari for best security and performance."
          },
          {
            "@type": "HowToStep",
            "name": "Clear browser cache regularly",
            "text": "Regularly clear your browser cache and temporary files to maintain optimal performance."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Most Popular Online Tools",
        "description": "Top-rated free online tools for everyday tasks",
        "numberOfItems": 6,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Image Compressor",
            "description": "Compress images online for free",
            "url": "https://utilbyte.app/image-tools/compress-image"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PDF Merger",
            "description": "Merge PDF files online",
            "url": "https://utilbyte.app/pdf-tools/merge-pdf"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "JSON Formatter",
            "description": "Format and validate JSON",
            "url": "https://utilbyte.app/dev-tools/json-formatter"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "QR Code Generator",
            "description": "Create custom QR codes",
            "url": "https://utilbyte.app/utility-tools/qr-code"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Password Generator",
            "description": "Generate secure passwords",
            "url": "https://utilbyte.app/utility-tools/password-generator"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Word Counter",
            "description": "Count words and characters",
            "url": "https://utilbyte.app/text-tools/word-counter"
          }
        ]
      }
    ]) // <-- only JSON.stringify
  }
};

export default function HomePage() {
  return <HomePageClient />;
}

import QRCodeGenerator from "@/components/tools/utility/QRCodeGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator Online Free - Custom QR Codes with Logo & Colors",
  description:
    "Create custom QR codes online for free with logos, colors, and advanced settings. Generate QR codes for URLs, WiFi, contacts, locations. Download in PNG, SVG, JPEG formats.",
  keywords: [
    "qr code generator online free",
    "custom qr code generator",
    "qr code with logo",
    "colored qr code maker",
    "advanced qr code creator",
    "wifi qr code generator",
    "vcard qr code",
    "qr code designer online",
    "qr code customization",
    "qr code maker free",
    "dynamic qr code",
    "qr code for business"
  ],
  openGraph: {
    title: "QR Code Generator Online Free - Custom QR Codes",
    description: "Create custom QR codes with logos, colors, and advanced settings. Generate for URLs, WiFi, contacts, locations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator Online Free - Custom Design",
    description: "Create custom QR codes online for free. Add logos, colors, generate for URLs, WiFi, contacts, locations.",
  },
  alternates: {
    canonical: "/utility-tools/qr-code",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "QR Code Generator Online Free",
        "description": "Create custom QR codes online for free with logos, colors, and advanced settings. Generate QR codes for URLs, WiFi, contacts, locations. Download in PNG, SVG, JPEG formats.",
        "url": "https://utilbyte.app/utility-tools/qr-code",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom QR codes with logos",
          "Color customization",
          "Multiple data types support",
          "High resolution output",
          "Multiple export formats"
        ],
        "screenshot": "https://utilbyte.app/images/qr-code-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I create a custom QR code?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply enter your URL, text, or contact information, customize colors and add logos if desired, then download your QR code in PNG, SVG, or JPEG format."
            }
          },
          {
            "@type": "Question",
            "name": "What types of QR codes can I generate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generate QR codes for URLs, WiFi networks, contact cards (vCard), locations, email addresses, phone numbers, and plain text."
            }
          },
          {
            "@type": "Question",
            "name": "Can I add my logo to QR codes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload and add your logo to QR codes. The system will automatically adjust the logo size and position for optimal scanning."
            }
          },
          {
            "@type": "Question",
            "name": "Are generated QR codes scannable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all QR codes generated are fully scannable and compliant with QR code standards. Test them with any QR code reader app."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Complete Guide to Creating QR Codes for Business",
        "description": "Learn how to create effective QR codes for marketing, contact sharing, WiFi access, and more.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Choose QR code content type",
            "text": "Select from URL, text, contact info, WiFi credentials, or other data types based on your needs."
          },
          {
            "@type": "HowToStep",
            "name": "Design your QR code",
            "text": "Customize colors, add logos, and adjust error correction levels for better scanning."
          },
          {
            "@type": "HowToStep",
            "name": "Test scanning functionality",
            "text": "Always test your QR code with multiple devices and QR code readers before publishing."
          },
          {
            "@type": "HowToStep",
            "name": "Optimize placement and size",
            "text": "Ensure QR codes are large enough to scan (at least 1 inch) and placed in high-visibility areas."
          },
          {
            "@type": "HowToStep",
            "name": "Track and analyze performance",
            "text": "Monitor scan rates and user engagement to optimize your QR code strategy."
          }
        ],
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "QR Code Reader App",
            "description": "Mobile app for testing QR code scanning"
          },
          {
            "@type": "HowToSupply",
            "name": "High-resolution printer",
            "description": "For printing physical QR codes"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "UtilByte QR Code Generator",
            "description": "Free online QR code generator with advanced customization options"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "QR Code Use Cases and Applications",
        "description": "Popular ways to use QR codes in business and personal applications",
        "numberOfItems": 8,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Website URLs",
            "description": "Link to websites, landing pages, or specific content"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact Information",
            "description": "Share vCard contact details for easy saving"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "WiFi Credentials",
            "description": "Share WiFi network name and password"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Payment Links",
            "description": "Link to payment pages or cryptocurrency addresses"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Social Media",
            "description": "Link to social media profiles or posts"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Email Addresses",
            "description": "Create mailto links with pre-filled subject lines"
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Phone Numbers",
            "description": "Create clickable phone number links"
          },
          {
            "@type": "ListItem",
            "position": 8,
            "name": "Plain Text",
            "description": "Share text messages, quotes, or instructions"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3200",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "QR Code Generator",
          "description": "Free online QR code generator with customization options"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Generator Online",
        "description": "Create fully customizable QR codes online for free. Generate QR codes with colors, logos, and different sizes for websites, text, and more.",
        "url": "https://utilbyte.app/utility-tools/qr-code",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom QR code colors",
          "Logo embedding",
          "Multiple sizes",
          "High resolution output",
          "Instant generation",
          "Download multiple formats"
        ],
        "screenshot": "https://utilbyte.app/images/qr-code-screenshot.jpg",
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
            "name": "QR Code Generator",
            "item": "https://utilbyte.app/utility-tools/qr-code"
          }
        ]
      }
    ])
  }
};

export default function QRCodeGeneratorPage() {
  return <QRCodeGenerator />;
}

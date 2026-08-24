import BarcodeGenerator from "@/components/tools/utility/BarcodeGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcode Generator Online Free - Generate EAN13 CODE128 UPC Barcodes",
  description:
    "Generate barcode formats online for free. Create EAN13, CODE128, UPC, CODE39, ITF, CODABAR barcodes. Perfect for products, inventory, and retail.",
  keywords: [
    "barcode generator online free",
    "ean13 barcode generator",
    "code128 barcode generator",
    "upc barcode generator",
    "code39 barcode generator",
    "barcode maker online",
    "generate product barcode",
    "inventory barcode creator",
    "retail barcode generator",
    "shipping barcode",
    "barcode label maker",
    "online barcode creator"
  ],
  openGraph: {
    title: "Barcode Generator Online Free - Product Barcodes",
    description: "Generate EAN13, CODE128, UPC, CODE39 barcodes online for free. Perfect for products and inventory.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode Generator Online Free - Retail Codes",
    description: "Generate product barcodes online for free. EAN13, CODE128, UPC, CODE39 formats for retail and inventory.",
  },
  alternates: {
    canonical: "/utility-tools/barcode",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Barcode Generator Online Free",
        "description": "Generate barcode formats online for free. Create EAN13, CODE128, UPC, CODE39, ITF, CODABAR barcodes. Perfect for products, inventory, and retail.",
        "url": "https://utilbyte.app/utility-tools/barcode",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple barcode formats",
          "High-resolution output",
          "Product labeling",
          "Inventory management",
          "Retail applications",
          "PNG and SVG export"
        ],
        "screenshot": "https://utilbyte.app/images/barcode-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What barcode formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generate EAN13, CODE128, UPC-A, UPC-E, CODE39, ITF, CODABAR, and other standard barcode formats."
            }
          },
          {
            "@type": "Question",
            "name": "What are barcodes used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Barcodes are used for product identification, inventory tracking, retail checkout, asset management, and supply chain logistics."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use generated barcodes commercially?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, generated barcodes can be used for commercial purposes. Ensure you follow barcode standards and regulations for your industry."
            }
          }
        ]
      }
    ];

export default function BarcodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BarcodeGenerator />
    </>
  );
}

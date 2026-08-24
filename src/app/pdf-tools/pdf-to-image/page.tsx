import PDFToImage from "@/components/tools/pdf/PDFToImage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert PDF to Image Online Free - PDF to JPG PNG Converter",
  description:
    "Convert PDF to image online for free. Transform PDF pages to high-quality JPG, PNG, or other image formats instantly. Extract images from PDF documents.",
  keywords: [
    "convert pdf to image online",
    "pdf to jpg converter",
    "pdf to png converter",
    "pdf to image online free",
    "extract images from pdf",
    "pdf page to image",
    "online pdf to image converter",
    "pdf to picture converter",
    "convert pdf to jpg online",
    "pdf to image converter free"
  ],
  openGraph: {
    title: "Convert PDF to Image Online Free - PDF to JPG PNG",
    description: "Convert PDF to image online instantly. Transform PDF pages to JPG, PNG formats. Free, fast, and high-quality conversion.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert PDF to Image Online Free",
    description: "Transform PDF to image online for free. Convert PDF pages to JPG, PNG instantly with high quality.",
  },
  alternates: {
    canonical: "/pdf-tools/pdf-to-image",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Convert PDF to Image Online Free",
        "description": "Convert PDF to image online for free. Transform PDF pages to high-quality JPG, PNG, or other image formats instantly. Extract images from PDF documents.",
        "url": "https://utilbyte.app/pdf-tools/pdf-to-image",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "PDF to image conversion",
          "Multiple output formats",
          "Page range selection",
          "High-quality output",
          "Batch processing",
          "Document extraction"
        ],
        "screenshot": "https://utilbyte.app/images/pdf-to-image-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What image formats can I convert PDF to?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Convert PDF pages to JPG, PNG, WebP, BMP, and other popular image formats."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert specific pages only?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can select specific page ranges or convert all pages from your PDF document."
            }
          },
          {
            "@type": "Question",
            "name": "What's the quality of the converted images?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We maintain high image quality during conversion, preserving text clarity and image details."
            }
          }
        ]
      }
    ])
  }
};

export default function PDFToImagePage() {
  return <PDFToImage />;
}

import PDFCompress from "@/components/tools/pdf/PDFCompress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online Free - Reduce PDF File Size by 80% Instantly",
  description:
    "Compress PDF files online for free. Reduce PDF file size by up to 80% without losing quality. Fast, secure, and works in your browser. No software download required.",
  keywords: [
    "compress pdf online free",
    "reduce pdf file size",
    "pdf compressor online",
    "compress pdf file size",
    "shrink pdf online",
    "pdf size reducer",
    "compress pdf without losing quality",
    "online pdf compression",
    "pdf optimizer",
    "reduce pdf size online"
  ],
  openGraph: {
    title: "Compress PDF Online Free - Reduce File Size by 80%",
    description: "Compress PDF files instantly online. Reduce file size by up to 80% without quality loss. Fast, free, and secure PDF compression tool.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online Free - 80% Size Reduction",
    description: "Compress PDF files online for free. Reduce file size instantly without losing quality. Works in browser, no download needed.",
  },
  alternates: {
    canonical: "/pdf-tools/compress-pdf",
  }
};


const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": "PDF Compression Service",
          "description": "Professional PDF compression service that reduces file sizes by up to 80% while maintaining document quality. Perfect for email attachments, web sharing, and storage optimization.",
          "provider": {
            "@type": "Organization",
            "name": "UtilByte",
            "url": "https://utilbyte.app"
          },
          "serviceType": "Document Processing",
          "areaServed": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "PDF Processing Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Free PDF Compression",
                  "description": "Compress unlimited PDF files for free"
                }
              }
            ]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "980",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "WebApplication",
          "name": "PDF Compressor Online Free",
          "description": "Compress PDF files online for free. Reduce PDF file size by up to 80% without losing quality. Fast, secure, and works in your browser.",
          "url": "https://utilbyte.app/pdf-tools/compress-pdf",
          "applicationCategory": "Utility",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Reduce PDF file size by up to 80%",
            "Maintain document quality",
            "Fast compression",
            "No file upload required",
            "Works in browser"
          ],
          "screenshot": "https://utilbyte.app/images/pdf-compress-screenshot.jpg"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How much can I reduce PDF file size?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our advanced compression can reduce PDF file sizes by up to 80% while maintaining document quality and readability."
              }
            },
            {
              "@type": "Question",
              "name": "Will PDF quality be affected by compression?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our compression algorithm preserves text quality and important visual elements while optimizing images and removing unnecessary data."
              }
            },
            {
              "@type": "Question",
              "name": "What types of PDFs can be compressed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can compress any PDF file including scanned documents, images, text documents, and mixed content PDFs."
              }
            },
            {
              "@type": "Question",
              "name": "Is PDF compression secure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all compression happens locally in your browser. Your PDF files never leave your device or get uploaded to any server."
              }
            }
          ]
        }
      ]
    };

export default function CompressPDFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PDFCompress />
    </>
  );
}

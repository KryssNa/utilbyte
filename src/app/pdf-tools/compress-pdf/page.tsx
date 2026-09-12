import PDFCompress from "@/components/tools/pdf/PDFCompress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online Free - Optimize PDF Structure",
  description:
    "Optimize PDF structure and object streams in your browser. Remove document metadata optionally, then compare file sizes before downloading. Savings vary by PDF.",
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
    title: "Compress PDF Online Free - Optimize PDF Structure",
    description: "Optimize PDF structure locally in your browser and compare the result with the original. Existing PDF images are not re-encoded.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online Free - Optimize PDF Structure",
    description: "Optimize PDF structure and object streams in your browser. Results depend on the original PDF; size reduction is not guaranteed.",
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
          "description": "Browser-based PDF structure optimization with object stream controls and optional document metadata removal. Existing images are not re-encoded.",
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
          }        },
        {
          "@type": "WebApplication",
          "name": "PDF Compressor Online Free",
          "description": "Optimize PDF structure and object streams locally with optional document metadata removal. File size savings vary.",
          "url": "https://utilbyte.app/pdf-tools/compress-pdf",
          "applicationCategory": "Utility",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Optimize PDF structure and object streams",
            "Existing images are not re-encoded",
            "Fast compression",
            "No file upload required",
            "Works in browser"
          ],
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How much can I reduce PDF file size?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Savings depend on the original structure. Already optimized PDFs may not shrink and can become larger. Compare the actual result before downloading."
              }
            },
            {
              "@type": "Question",
              "name": "Will PDF quality be affected by compression?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "This tool copies PDF pages and optimizes document structure and object streams. It does not downsample or re-encode existing images. Review the resulting document before use."
              }
            },
            {
              "@type": "Question",
              "name": "What types of PDFs can be compressed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use a PDF that the tool can open. Structural optimization may help some files, but scanned PDFs can remain large because embedded images are not re-encoded."
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

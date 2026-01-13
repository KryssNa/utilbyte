import PDFMerge from "@/components/tools/pdf/PDFMerge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Online Free - Combine Multiple PDFs Into One",
  description:
    "Merge PDF files online for free. Combine multiple PDFs into a single document instantly. Drag to reorder pages before merging. No upload required - works in your browser.",
  keywords: [
    "merge pdf online free",
    "combine pdf files",
    "pdf merger online",
    "merge multiple pdfs",
    "join pdf files",
    "pdf combiner",
  ],
  openGraph: {
    title: "Merge PDF Online Free - Combine Multiple PDFs",
    description: "Merge PDF files online for free. Combine multiple PDFs into one document instantly. Drag to reorder pages.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online Free - PDF Combiner",
    description: "Merge PDF files online for free. Combine multiple PDFs into one document. No upload required.",
  },
  alternates: {
    canonical: "/pdf-tools/merge-pdf",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PDF Merger Online Free",
        "description": "Merge PDF files online for free. Combine multiple PDFs into a single document instantly. Drag to reorder pages before merging.",
        "url": "https://utilbyte.app/pdf-tools/merge-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Merge multiple PDF files",
          "Drag to reorder pages",
          "No file size limits",
          "Fast processing",
          "Download merged PDF"
        ],
        "screenshot": "https://utilbyte.app/images/pdf-merge-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many PDF files can I merge?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can merge unlimited PDF files. Simply drag and drop or select multiple PDF files to combine them into one document."
            }
          },
          {
            "@type": "Question",
            "name": "Can I reorder pages before merging?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can drag and drop to reorder pages from different PDF files before merging them into the final document."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a file size limit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No file size limits. All processing happens locally in your browser, so you can merge PDFs of any size."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "Service",
          "name": "PDF Merge Tool",
          "description": "Free online PDF merging tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF Merge Online Free",
        "description": "Merge multiple PDF files into one document online for free. Combine PDFs in any order with our fast, secure PDF merger tool.",
        "url": "https://utilbyte.app/pdf-tools/merge-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Merge unlimited PDF files",
          "Custom page ordering",
          "Fast processing",
          "No file size limits",
          "Secure local processing"
        ],
        "screenshot": "https://utilbyte.app/images/pdf-merge-screenshot.jpg",
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
            "name": "PDF Tools",
            "item": "https://utilbyte.app/pdf-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Merge PDF",
            "item": "https://utilbyte.app/pdf-tools/merge-pdf"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Merge PDF Files Online",
        "description": "Learn how to combine multiple PDF documents into a single file online quickly and easily.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select PDF files",
            "text": "Choose multiple PDF files you want to merge together from your device."
          },
          {
            "@type": "HowToStep",
            "name": "Arrange order",
            "text": "Drag and drop the files to arrange them in your desired order."
          },
          {
            "@type": "HowToStep",
            "name": "Merge PDFs",
            "text": "Click the merge button to combine all files into one PDF document."
          },
          {
            "@type": "HowToStep",
            "name": "Download merged PDF",
            "text": "Download your single, merged PDF file instantly."
          }
        ]
      }
    ])
  }
};

export default function MergePDFPage() {
  return <PDFMerge />;
}

import PDFSplit from "@/components/tools/pdf/PDFSplit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Online Free - Extract Pages from PDF Document",
  description:
    "Split PDF files online for free. Extract specific pages or split PDF into multiple documents instantly. Choose page ranges or individual pages to extract.",
  keywords: [
    "split pdf online free",
    "extract pages from pdf",
    "pdf splitter online",
    "split pdf into multiple files",
    "extract pdf pages",
    "pdf page extractor",
    "divide pdf online",
    "split pdf by pages",
    "online pdf splitter",
    "pdf page separator"
  ],
  openGraph: {
    title: "Split PDF Online Free - Extract PDF Pages",
    description: "Split PDF files online instantly. Extract specific pages or divide PDFs into multiple documents. Free and easy to use.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online Free - Extract Pages",
    description: "Split PDF online for free. Extract pages, divide PDFs into multiple files. Choose page ranges or individual pages.",
  },
  alternates: {
    canonical: "/pdf-tools/split-pdf",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Split PDF Online Free",
        "description": "Split PDF files online for free. Extract specific pages or split PDF into multiple documents instantly. Choose page ranges or individual pages to extract.",
        "url": "https://utilbyte.app/pdf-tools/split-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Page range extraction",
          "Individual page splitting",
          "Multiple document creation",
          "Custom page selection",
          "Document organization",
          "Fast processing"
        ],
        "screenshot": "https://utilbyte.app/images/split-pdf-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I split a PDF into multiple files?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Specify page ranges or select individual pages you want to extract. Each selection becomes a separate PDF document."
            }
          },
          {
            "@type": "Question",
            "name": "Can I extract specific pages only?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can select specific pages (like pages 1, 3, 5) or page ranges (like pages 2-4) to extract into separate documents."
            }
          },
          {
            "@type": "Question",
            "name": "What's the best way to organize split documents?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use clear page ranges and naming conventions. For example, split invoices by date ranges or contracts by sections."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Split PDF Files Online",
        "description": "Learn how to split large PDF documents into smaller, more manageable files online.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload PDF file",
            "text": "Select the PDF document you want to split from your device."
          },
          {
            "@type": "HowToStep",
            "name": "Choose split method",
            "text": "Select how you want to split: by page ranges, extract specific pages, or divide equally."
          },
          {
            "@type": "HowToStep",
            "name": "Specify pages",
            "text": "Enter the page numbers or ranges you want to extract (e.g., 1-5, 8, 10-15)."
          },
          {
            "@type": "HowToStep",
            "name": "Split and download",
            "text": "Process the PDF and download your split documents as separate files."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1400",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "PDF Split Tool",
          "description": "Free online PDF splitting tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF Split Online Free",
        "description": "Split PDF files online for free. Extract specific pages or divide large PDF documents into smaller files with ease.",
        "url": "https://utilbyte.app/pdf-tools/split-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Split by page ranges",
          "Extract specific pages",
          "Custom file naming",
          "Batch processing",
          "Fast splitting",
          "Secure processing"
        ],
        "screenshot": "https://utilbyte.app/images/pdf-split-screenshot.jpg",
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
            "name": "Split PDF",
            "item": "https://utilbyte.app/pdf-tools/split-pdf"
          }
        ]
      }
    ])
  }
};

export default function SplitPDFPage() {
  return <PDFSplit />;
}

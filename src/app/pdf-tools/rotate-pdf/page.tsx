import PDFRotate from "@/components/tools/pdf/PDFRotate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Online Free - Rotate PDF Pages 90° 180° 270°",
  description:
    "Rotate PDF pages online for free. Rotate PDF documents by 90°, 180°, or 270° degrees instantly. Fix upside down or sideways PDF pages with ease.",
  keywords: [
    "rotate pdf online free",
    "rotate pdf pages",
    "pdf rotator online",
    "rotate pdf 90 degrees",
    "rotate pdf 180 degrees",
    "fix rotated pdf",
    "pdf page rotation",
    "online pdf rotator",
    "rotate pdf clockwise",
    "rotate pdf counterclockwise"
  ],
  openGraph: {
    title: "Rotate PDF Online Free - Fix Rotated PDF Pages",
    description: "Rotate PDF pages online instantly. Fix upside down or sideways PDFs by 90°, 180°, 270° degrees. Free and fast.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Online Free - Fix PDF Orientation",
    description: "Rotate PDF pages online for free. Fix rotated PDFs instantly - 90°, 180°, 270° rotation supported.",
  },
  alternates: {
    canonical: "/pdf-tools/rotate-pdf",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Rotate PDF Online Free",
        "description": "Rotate PDF pages online for free. Rotate PDF documents by 90°, 180°, or 270° degrees instantly. Fix upside down or sideways PDF pages with ease.",
        "url": "https://utilbyte.app/pdf-tools/rotate-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "90°, 180°, 270° rotation",
          "Individual page rotation",
          "Batch processing",
          "Orientation correction",
          "Document repair",
          "Instant processing"
        ],
        "screenshot": "https://utilbyte.app/images/rotate-pdf-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Rotate PDF Pages Online",
        "description": "Learn how to rotate PDF pages online to fix orientation issues quickly.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload PDF",
            "text": "Upload the PDF document with incorrectly oriented pages."
          },
          {
            "@type": "HowToStep",
            "name": "Select rotation",
            "text": "Choose rotation angle (90°, 180°, or 270°) for each page."
          },
          {
            "@type": "HowToStep",
            "name": "Apply rotation",
            "text": "Apply the rotation to fix page orientation."
          },
          {
            "@type": "HowToStep",
            "name": "Download fixed PDF",
            "text": "Download your corrected PDF document."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I rotate all pages or individual pages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can rotate all pages at once with the same angle, or rotate individual pages to different orientations as needed."
            }
          },
          {
            "@type": "Question",
            "name": "What rotation angles are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can rotate pages by 90°, 180°, or 270° clockwise or counterclockwise to achieve the desired orientation."
            }
          },
          {
            "@type": "Question",
            "name": "Will the PDF quality be affected by rotation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, rotating pages digitally preserves the original quality and doesn't affect text, images, or document structure."
            }
          },
          {
            "@type": "Question",
            "name": "Can I rotate scanned documents or images in PDFs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can rotate any type of PDF content including scanned documents, images, and mixed content pages."
            }
          }
        ]
      }
    ];

export default function PDFRotatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PDFRotate />
    </>
  );
}

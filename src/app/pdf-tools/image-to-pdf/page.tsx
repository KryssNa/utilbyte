import ImageToPDF from "@/components/tools/pdf/ImageToPDF";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Image to PDF Online Free - JPG PNG to PDF Converter",
  description:
    "Convert images to PDF online for free. Transform JPG, PNG, GIF, and other image formats to high-quality PDF documents instantly. Batch conversion supported.",
  keywords: [
    "convert image to pdf online",
    "image to pdf converter",
    "jpg to pdf",
    "png to pdf",
    "picture to pdf",
    "photo to pdf converter",
    "convert multiple images to pdf",
    "online image to pdf",
    "free image to pdf converter",
    "image to pdf online free"
  ],
  openGraph: {
    title: "Convert Image to PDF Online Free - JPG PNG to PDF",
    description: "Convert images to PDF online instantly. Transform JPG, PNG, GIF to PDF. Free, fast, and supports batch conversion.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image to PDF Online Free",
    description: "Transform images to PDF online for free. Convert JPG, PNG, GIF to PDF instantly with batch support.",
  },
  alternates: {
    canonical: "/pdf-tools/image-to-pdf",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Convert Image to PDF Online Free",
        "description": "Convert images to PDF online for free. Transform JPG, PNG, GIF, and other image formats to high-quality PDF documents instantly. Batch conversion supported.",
        "url": "https://utilbyte.app/pdf-tools/image-to-pdf",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple image formats",
          "Batch conversion",
          "High-quality PDF output",
          "Custom page sizes",
          "Fast processing",
          "Document creation"
        ],
        "screenshot": "https://utilbyte.app/images/image-to-pdf-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Convert Images to PDF Online",
        "description": "Learn how to convert images to PDF documents online quickly and easily.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select images",
            "text": "Choose JPG, PNG, or other image files you want to convert."
          },
          {
            "@type": "HowToStep",
            "name": "Upload and arrange",
            "text": "Upload images and arrange them in your desired order."
          },
          {
            "@type": "HowToStep",
            "name": "Configure settings",
            "text": "Set page size, orientation, and quality preferences."
          },
          {
            "@type": "HowToStep",
            "name": "Convert to PDF",
            "text": "Generate and download your PDF document instantly."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What image formats can I convert to PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can convert JPG, PNG, GIF, BMP, TIFF, WebP, and other common image formats to PDF documents."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert multiple images to one PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload multiple images and combine them into a single PDF document with custom page ordering."
            }
          },
          {
            "@type": "Question",
            "name": "Will image quality be preserved in PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our converter maintains high image quality. You can also adjust compression settings if needed."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a limit on file size or number of images?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "File size limits depend on your browser, but you can typically convert dozens of images at once without issues."
            }
          }
        ]
      }
    ];

export default function ImageToPDFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageToPDF />
    </>
  );
}

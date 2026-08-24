import ImageOCR from "@/components/tools/image/ImageOCR";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR Online Free - Extract Text from Image - Image to Text Converter",
  description:
    "Extract text from images with advanced OCR technology. Convert scanned documents, photos, and screenshots to editable text instantly. Supports multiple languages.",
  keywords: [
    "ocr online free",
    "extract text from image",
    "image to text converter",
    "online ocr tool",
    "optical character recognition",
    "convert image to text",
    "scan to text",
    "photo to text",
    "ocr scanner online",
    "text recognition online",
    "image text extractor"
  ],
  openGraph: {
    title: "OCR Online Free - Extract Text from Image",
    description: "Convert images to text with advanced OCR technology. Extract text from photos, scans, and screenshots instantly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OCR Online Free - Image to Text Converter",
    description: "Extract text from images online for free. Advanced OCR converts photos and scans to editable text instantly.",
  },
  alternates: {
    canonical: "/image-tools/ocr",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "OCR Online Free - Extract Text from Image",
        "description": "Extract text from images with advanced OCR technology. Convert scanned documents, photos, and screenshots to editable text instantly. Supports multiple languages.",
        "url": "https://utilbyte.app/image-tools/ocr",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Advanced OCR technology",
          "Multiple language support",
          "High accuracy text extraction",
          "Process images and PDFs",
          "Copy extracted text"
        ],
        "screenshot": "https://utilbyte.app/images/ocr-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of images can be processed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can process JPG, PNG, GIF, WebP images, screenshots, scanned documents, and PDF files containing text."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the text recognition?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our OCR technology provides high accuracy text extraction, especially for clear, well-formatted documents. Results may vary with image quality."
            }
          },
          {
            "@type": "Question",
            "name": "What languages are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Supports multiple languages including English, Spanish, French, German, Italian, Portuguese, and many others."
            }
          },
          {
            "@type": "Question",
            "name": "Can I extract text from PDFs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload PDF files and extract text from them using the OCR functionality."
            }
          }
        ]
      }
    ])
  }
};

export default function OCRPage() {
  return <ImageOCR />;
}

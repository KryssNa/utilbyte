import FormatConverter from "@/components/tools/image/FormatConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Image Format Online Free - JPG PNG WebP GIF Converter",
  description:
    "Convert images between JPG, PNG, WebP, GIF, BMP, TIFF formats online for free. Fast format conversion with quality control. Batch conversion supported.",
  keywords: [
    "convert image format online free",
    "jpg to png converter",
    "png to jpg converter",
    "webp to jpg converter",
    "image format converter online",
    "convert png to jpg",
    "convert jpg to png",
    "gif converter online",
    "photo format converter",
    "batch image converter"
  ],
  openGraph: {
    title: "Convert Image Format Online Free - JPG PNG WebP GIF",
    description: "Convert images between JPG, PNG, WebP, GIF, BMP formats online for free. Fast conversion with quality control.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image Format Online Free",
    description: "Convert images between JPG, PNG, WebP, GIF formats online for free. Fast, high-quality format conversion.",
  },
  alternates: {
    canonical: "/image-tools/format-converter",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Convert Image Format Online Free",
        "description": "Convert images between JPG, PNG, WebP, GIF, BMP, TIFF formats online for free. Fast format conversion with quality control. Batch conversion supported.",
        "url": "https://utilbyte.app/image-tools/format-converter",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple format support",
          "Batch conversion",
          "Quality control",
          "Fast processing",
          "Lossless conversion",
          "Format optimization"
        ],
        "screenshot": "https://utilbyte.app/images/format-converter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What image formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support conversion between JPG, PNG, WebP, GIF, BMP, TIFF, and other popular image formats."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert multiple images at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our batch conversion feature allows you to convert multiple images simultaneously for efficiency."
            }
          },
          {
            "@type": "Question",
            "name": "Is there quality loss during conversion?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use optimized conversion algorithms that maintain image quality. You can also adjust quality settings for different use cases."
            }
          }
        ]
      }
    ];

export default function FormatConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FormatConverter />
    </>
  );
}


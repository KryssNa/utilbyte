import ColorConverter from "@/components/tools/utility/ColorConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter Online Free - HEX RGB HSL HSV CMYK Color Converter",
  description:
    "Convert between color formats online for free. HEX, RGB, HSL, HSV, CMYK conversions with color picker, palette generator, and visual preview. Perfect for designers and developers.",
  keywords: [
    "color converter online free",
    "hex to rgb converter",
    "rgb to hex converter",
    "hsl to rgb converter",
    "color picker online",
    "hex color code converter",
    "rgb color converter",
    "hsl color converter",
    "hsv color converter",
    "cmyk color converter",
    "color palette generator",
    "web color converter",
    "css color converter"
  ],
  openGraph: {
    title: "Color Converter Online Free - HEX RGB HSL Converter",
    description: "Convert between HEX, RGB, HSL, HSV, CMYK color formats online for free. Color picker and palette generator.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Converter Online Free - Design Tool",
    description: "Convert HEX, RGB, HSL, HSV, CMYK colors online for free. Perfect for designers and web developers.",
  },
  alternates: {
    canonical: "/utility-tools/color-converter",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Color Converter Online Free",
        "description": "Convert between color formats online for free. HEX, RGB, HSL, HSV, CMYK conversions with color picker, palette generator, and visual preview. Perfect for designers and developers.",
        "url": "https://utilbyte.app/utility-tools/color-converter",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple color format conversion",
          "Interactive color picker",
          "Color palette generation",
          "Visual color preview",
          "HEX, RGB, HSL, HSV, CMYK support"
        ],
        "screenshot": "https://utilbyte.app/images/color-converter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What color formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Supports HEX, RGB, HSL, HSV, and CMYK color formats with automatic conversion between all formats."
            }
          },
          {
            "@type": "Question",
            "name": "Can I pick colors visually?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the interactive color picker allows you to select colors visually and see the corresponding values in different formats."
            }
          },
          {
            "@type": "Question",
            "name": "How do I use this for web development?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Perfect for converting between CSS color formats. Get HEX codes for HTML, RGB/RGBA for CSS, and HSL for modern CSS features."
            }
          }
        ]
      }
    ];

export default function ColorConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorConverter />
    </>
  );
}

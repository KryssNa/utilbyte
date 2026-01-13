import ImageResizer from "@/components/tools/image/ImageResizer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resize Image Online Free - Change Photo Dimensions Instantly",
  description:
    "Resize images online for free. Change dimensions, scale photos, maintain aspect ratio, or use presets for Instagram, Facebook, Twitter. Perfect for social media and web.",
  keywords: [
    "resize image online free",
    "resize photo online",
    "change image dimensions",
    "image resizer tool",
    "scale image online",
    "resize picture",
    "photo resizer online",
    "resize image for social media",
    "change photo size",
    "image dimension converter",
    "online photo resizer"
  ],
  openGraph: {
    title: "Resize Image Online Free - Change Dimensions",
    description: "Resize images online for free. Change dimensions, scale photos, social media presets. Fast and easy resizing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Image Online Free - Photo Resizer",
    description: "Resize photos online for free. Change dimensions, social media presets, maintain quality and aspect ratio.",
  },
  alternates: {
    canonical: "/image-tools/resize-image",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Resize Image Online Free",
        "description": "Resize images online for free. Change dimensions, scale photos, maintain aspect ratio, or use presets for Instagram, Facebook, Twitter. Perfect for social media and web.",
        "url": "https://utilbyte.app/image-tools/resize-image",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom dimension resizing",
          "Aspect ratio preservation",
          "Social media presets",
          "Batch resizing",
          "Quality maintenance",
          "Real-time preview"
        ],
        "screenshot": "https://utilbyte.app/images/resize-image-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I maintain aspect ratio when resizing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enable the 'Maintain Aspect Ratio' option to automatically adjust dimensions proportionally and prevent image distortion."
            }
          },
          {
            "@type": "Question",
            "name": "What are the recommended sizes for social media?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use our presets: Instagram posts (1080x1080), Facebook cover (820x312), Twitter header (1500x500), and more."
            }
          },
          {
            "@type": "Question",
            "name": "Can I resize multiple images at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our batch processing feature allows you to resize multiple images simultaneously with the same settings."
            }
          }
        ]
      }
    ])
  }
};

export default function ResizeImagePage() {
  return <ImageResizer />;
}


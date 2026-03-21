import ImageBackgroundRemover from "@/components/tools/image/ImageBackgroundRemover";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Background Online Free - AI Background Remover Tool",
  description:
    "Remove image backgrounds automatically with AI-powered technology. Perfect for product photos, portraits, and e-commerce. Free, fast, and high-quality results.",
  keywords: [
    "remove background online free",
    "background remover ai",
    "remove image background",
    "ai background removal",
    "transparent background maker",
    "remove photo background",
    "background eraser online",
    "cut out image background",
    "transparent background tool",
    "remove background from photo",
    "ai background remover online"
  ],
  openGraph: {
    title: "Remove Background Online Free - AI Background Remover",
    description: "Remove image backgrounds automatically with AI. Perfect for product photos and e-commerce. Free and high-quality.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background Online Free - AI Tool",
    description: "AI-powered background remover. Remove backgrounds from photos instantly. Free, fast, and professional quality.",
  },
  alternates: {
    canonical: "/image-tools/remove-background",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Remove Background Online Free",
        "description": "Remove image backgrounds automatically with AI-powered technology. Perfect for product photos, portraits, and e-commerce. Free, fast, and high-quality results.",
        "url": "https://utilbyte.app/image-tools/remove-background",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "AI-powered background removal",
          "High-precision cutouts",
          "Transparent PNG output",
          "Batch processing",
          "E-commerce ready",
          "Product photography optimization"
        ],
        "screenshot": "https://utilbyte.app/images/remove-background-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Remove Image Backgrounds Online",
        "description": "Learn how to remove backgrounds from images using AI technology for professional results.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload image",
            "text": "Upload the image from which you want to remove the background."
          },
          {
            "@type": "HowToStep",
            "name": "AI processing",
            "text": "Our AI automatically detects and removes the background."
          },
          {
            "@type": "HowToStep",
            "name": "Review and refine",
            "text": "Review the result and make any necessary adjustments."
          },
          {
            "@type": "HowToStep",
            "name": "Download PNG",
            "text": "Download your image with transparent background as PNG."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is the background removal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI-powered tool provides high accuracy for most images, especially those with clear subject-background separation. You can also manually refine edges if needed."
            }
          },
          {
            "@type": "Question",
            "name": "What types of images work best for background removal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Images with solid backgrounds, clear subjects, and good contrast work best. Product photos, portraits, and objects work well."
            }
          },
          {
            "@type": "Question",
            "name": "Will my image quality be preserved?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our algorithm preserves image quality and details while creating clean, professional transparent backgrounds."
            }
          },
          {
            "@type": "Question",
            "name": "Can I process multiple images at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Currently, images are processed one at a time to ensure the highest quality results for each image."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1600",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "Background Remover",
          "description": "Free online background removal tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Remove Background Online Free",
        "description": "Remove image backgrounds online for free using advanced AI technology. Create transparent PNGs with professional quality results.",
        "url": "https://utilbyte.app/image-tools/remove-background",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "AI-powered background removal",
          "Transparent PNG output",
          "High accuracy results",
          "Manual edge refinement",
          "Professional quality",
          "Fast processing"
        ],
        "screenshot": "https://utilbyte.app/images/remove-background-screenshot.jpg",
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
            "name": "Image Tools",
            "item": "https://utilbyte.app/image-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Remove Background",
            "item": "https://utilbyte.app/image-tools/remove-background"
          }
        ]
      }
    ];

export default function RemoveBackgroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageBackgroundRemover />
    </>
  );
}

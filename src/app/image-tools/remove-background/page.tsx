import ImageBackgroundRemover from "@/components/tools/image/ImageBackgroundRemover";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove a Solid Background Online Free - No Upload | UtilByte",
  description:
    "Remove a plain or solid background from an image by colour, with an adjustable tolerance. Best for product shots, logos and studio backdrops. Free, runs in your browser, no upload.",
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
    title: "Remove a Solid Background Online Free",
    description: "Remove a plain background by colour, with an adjustable tolerance. Best for product shots and logos. Free and private.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove a Solid Background Online Free",
    description: "Colour-based background remover for plain and studio backgrounds. Free, fast, nothing uploaded.",
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
        "description": "Remove a plain or solid background from an image by colour, with an adjustable tolerance. Best for product shots, logos and studio backdrops. Free, runs in your browser, no upload.",
        "url": "https://utilbyte.app/image-tools/remove-background",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Colour-based removal of plain backgrounds",
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
              "text": "It works by colour: it samples the background shade and makes every pixel within your tolerance transparent. That is very accurate on a plain, evenly lit backdrop and unreliable on hair, glass, or a busy background, where no tolerance setting gives a clean edge."
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
          "Colour-based removal of plain backgrounds",
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

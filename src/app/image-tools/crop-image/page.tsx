import ImageCropper from "@/components/tools/image/ImageCropper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Image Online Free - Precision Photo Cropping Tool",
  description:
    "Crop images online for free with precision selection tools. Adjust dimensions, aspect ratios, and crop any part of your photo instantly. Perfect for social media and printing.",
  keywords: [
    "crop image online free",
    "crop photo online",
    "image cropper online",
    "precision image cropping",
    "crop picture tool",
    "photo crop editor",
    "image cropping tool",
    "crop image to size",
    "online photo cropper",
    "crop image dimensions"
  ],
  openGraph: {
    title: "Crop Image Online Free - Precision Cropping Tool",
    description: "Crop images online with precision selection tools. Adjust dimensions and aspect ratios for perfect photo cropping.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Image Online Free - Precision Tool",
    description: "Crop photos online for free. Precision selection, adjust dimensions, perfect for social media and printing.",
  },
  alternates: {
    canonical: "/image-tools/crop-image",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Crop Image Online Free",
        "description": "Crop images online for free with precision selection tools. Adjust dimensions, aspect ratios, and crop any part of your photo instantly. Perfect for social media and printing.",
        "url": "https://utilbyte.app/image-tools/crop-image",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Precision cropping tools",
          "Aspect ratio presets",
          "Custom dimension input",
          "Real-time preview",
          "Multiple export formats",
          "Social media presets"
        ],
        "screenshot": "https://utilbyte.app/images/crop-image-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Crop Images Online",
        "description": "Learn how to crop images online with precision tools for perfect results.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload image",
            "text": "Select and upload the image you want to crop."
          },
          {
            "@type": "HowToStep",
            "name": "Select crop area",
            "text": "Use the selection tool to choose the area you want to keep."
          },
          {
            "@type": "HowToStep",
            "name": "Adjust dimensions",
            "text": "Set custom dimensions or use aspect ratio presets."
          },
          {
            "@type": "HowToStep",
            "name": "Apply and download",
            "text": "Apply the crop and download your perfectly cropped image."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What image formats can I crop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can crop JPG, PNG, GIF, BMP, WebP, and other common image formats with our online crop tool."
            }
          },
          {
            "@type": "Question",
            "name": "Can I crop images to specific dimensions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can enter exact pixel dimensions or use the visual crop tool to select your desired area precisely."
            }
          },
          {
            "@type": "Question",
            "name": "Will cropping affect image quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, cropping only changes the canvas size and doesn't affect the quality of the remaining image content."
            }
          },
          {
            "@type": "Question",
            "name": "Can I maintain aspect ratio while cropping?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can lock aspect ratios (like 1:1 for squares, 4:3 for photos) or crop freely to any dimensions you need."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "1100",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "Image Crop Tool",
          "description": "Free online image cropping tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Crop Online Free",
        "description": "Crop images online for free. Remove unwanted parts of images with precision cropping tools and aspect ratio controls.",
        "url": "https://utilbyte.app/image-tools/crop-image",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Precision cropping",
          "Aspect ratio controls",
          "Multiple image formats",
          "Real-time preview",
          "High-quality output",
          "Free to use"
        ],
        "screenshot": "https://utilbyte.app/images/image-crop-screenshot.jpg",
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
            "name": "Crop Image",
            "item": "https://utilbyte.app/image-tools/crop-image"
          }
        ]
      }
    ])
  }
};

export default function CropImagePage() {
  return <ImageCropper />;
}

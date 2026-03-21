import ImageCompressor from "@/components/tools/image/ImageCompressor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Image Online Free - Reduce Image File Size by 90% Losslessly",
  description:
    "Compress images online for free without losing quality. Reduce JPG, PNG, WebP file sizes by up to 90% instantly. Advanced compression algorithm works in your browser.",
  keywords: [
    "compress image online free",
    "compress image without losing quality",
    "reduce image file size",
    "image compression tool",
    "compress jpg online",
    "compress png online",
    "image optimizer online",
    "shrink image size",
    "photo compressor",
    "image size reducer",
    "lossless image compression"
  ],
  openGraph: {
    title: "Compress Image Online Free - 90% Size Reduction",
    description: "Compress images online for free. Reduce file sizes by up to 90% without quality loss. Fast, secure, browser-based compression.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Image Online Free - 90% Size Reduction",
    description: "Compress JPG, PNG, WebP images online for free. Reduce file sizes instantly without losing quality.",
  },
  alternates: {
    canonical: "/image-tools/compress-image",
  }
};


const jsonLd = [
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
            "item": "https://utilbyte.app#image-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Compress Image",
            "item": "https://utilbyte.app/image-tools/compress-image"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Online Image Compression Service",
        "description": "Professional image compression service that reduces file sizes by up to 90% while maintaining quality. Perfect for web optimization, faster loading times, and bandwidth savings.",
        "provider": {
          "@type": "Organization",
          "name": "UtilByte",
          "url": "https://utilbyte.app"
        },
        "serviceType": "Image Processing",
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Image Compression Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Free Image Compression",
                "description": "Compress unlimited images for free"
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Image Compressor Online Free",
        "description": "Compress images online for free without losing quality. Reduce JPG, PNG, WebP file sizes by up to 90% instantly. Advanced compression algorithm works in your browser.",
        "url": "https://utilbyte.app/image-tools/compress-image",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Reduce image file size by up to 90%",
          "Lossless compression",
          "Supports JPG, PNG, WebP",
          "Fast processing",
          "No quality loss"
        ],
        "screenshot": "https://utilbyte.app/images/image-compress-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Compress Images Online",
        "description": "Learn how to reduce image file sizes while maintaining quality using our free online compressor.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select images",
            "text": "Choose JPG, PNG, or WebP images you want to compress from your device."
          },
          {
            "@type": "HowToStep",
            "name": "Choose compression level",
            "text": "Select your preferred balance between file size reduction and image quality."
          },
          {
            "@type": "HowToStep",
            "name": "Compress images",
            "text": "Process your images with our advanced compression algorithm."
          },
          {
            "@type": "HowToStep",
            "name": "Download compressed images",
            "text": "Download your optimized images with significantly reduced file sizes."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much can I compress my images?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our advanced compression algorithm can reduce image file sizes by up to 90% while maintaining visual quality. The actual compression ratio depends on the original image and format."
            }
          },
          {
            "@type": "Question",
            "name": "Will image quality be affected?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our compressor uses lossless compression techniques that preserve image quality. You can adjust compression settings to balance file size and quality according to your needs."
            }
          },
          {
            "@type": "Question",
            "name": "What image formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support JPG, PNG, and WebP formats. Each format has optimized compression algorithms to achieve the best results for that specific image type."
            }
          },
          {
            "@type": "Question",
            "name": "Is this image compression secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely secure. All image processing happens locally in your browser. Your images never leave your device or get uploaded to any server."
            }
          }
        ]
      }
    ];

export default function CompressImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressor />
    </>
  );
}

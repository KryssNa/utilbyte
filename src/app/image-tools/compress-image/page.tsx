import ImageCompressor from "@/components/tools/image/ImageCompressor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor Online - Adjust JPEG Quality Free",
  description:
    "Reduce image file size with adjustable JPEG quality. Open a JPG, PNG or WebP image, compare the estimated size, and download a JPEG processed in your browser.",
  keywords: [
    "compress image online free",
    "adjust image compression quality",
    "reduce image file size",
    "image compression tool",
    "compress jpg online",
    "compress png online",
    "image optimizer online",
    "shrink image size",
    "photo compressor",
    "image size reducer",
    "jpeg image compression"
  ],
  openGraph: {
    title: "Image Compressor Online - Adjustable JPEG Quality",
    description: "Adjust JPEG quality and preview the estimated file size. Image processing runs in your browser; savings depend on the original image.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor Online - Adjustable JPEG Quality",
    description: "Open JPG, PNG or WebP images and download a JPEG with adjustable quality. Process images locally in your browser.",
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
            "item": "https://utilbyte.app/image-tools"
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
        "description": "Browser-based image compression with adjustable JPEG quality. Lower quality can reduce file size at the cost of image detail.",
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
        }      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Image Compressor Online Free",
        "description": "Reduce image file size with adjustable JPEG quality. Open a JPG, PNG or WebP image, compare the estimated size, and download a JPEG processed in your browser.",
        "url": "https://utilbyte.app/image-tools/compress-image",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Adjust JPEG compression quality",
          "Lossy JPEG compression",
          "Supports JPG, PNG, WebP",
          "Fast processing",
          "Preview estimated output size"
        ],
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
              "text": "Savings depend on the original image and quality setting. Already optimized images may not become smaller. Review the output size before downloading."
            }
          },
          {
            "@type": "Question",
            "name": "Will image quality be affected?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The tool uses lossy JPEG compression. Lower quality reduces detail and can create visible artifacts. Compare the result and choose the quality setting that suits your use."
            }
          },
          {
            "@type": "Question",
            "name": "What image formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Open JPG, PNG or WebP images. The compressor re-encodes the selected image as JPEG; it does not preserve transparency."
            }
          },
          {
            "@type": "Question",
            "name": "Is this image compression secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Image processing runs locally in your browser. The tool does not upload your selected image. Site analytics and advertising are separate from file processing."
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

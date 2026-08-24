import CompressToSize from "@/components/tools/image/CompressToSize";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Image to a Target Size - 20KB, 50KB, 100KB, 200KB | UtilByte",
  description:
    "Compress a photo to an exact file size limit. Enter 20KB, 50KB, 100KB or any target and get the best quality that fits. Runs in your browser, no upload, free.",
  keywords: [
    "compress image to size",
    "compress image to kb",
    "reduce image size in kb",
    "compress photo to 50kb",
    "compress image to 100kb",
    "compress jpeg to specific size",
    "image size reducer kb",
    "photo compressor for form upload",
    "resize photo for online form",
  ],
  openGraph: {
    title: "Compress Image to a Target Size",
    description:
      "State a KB limit and get the highest quality image that fits under it. Everything runs in your browser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Image to an Exact KB Limit",
    description:
      "For upload forms that demand under 20KB, 50KB or 100KB. Free, private, browser-based.",
  },
  alternates: {
    canonical: "/image-tools/compress-to-size",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Compress Image to Target Size",
      url: "https://utilbyte.app/image-tools/compress-to-size",
      description:
        "Browser-based image compressor that searches for the highest quality output fitting under a stated file size limit.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and HTML5 Canvas",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Target an exact file size in KB",
        "Automatic quality search",
        "Automatic downscaling when quality alone is not enough",
        "JPEG and WebP output",
        "Client-side processing, no upload",
      ],
    },
    {
      "@type": "HowTo",
      name: "How to compress an image to a specific KB size",
      description:
        "Reduce a photo to fit an upload form's file size limit without guessing at quality settings.",
      totalTime: "PT1M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add your image",
          text: "Drop the photo onto the page or choose it from your device. Nothing is uploaded.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Set the limit",
          text: "Pick a preset such as 50 KB or type the exact number the form asks for.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Choose the format",
          text: "JPEG for upload forms that check the extension, WebP when you control the destination.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Compress and check",
          text: "Review the resulting size, dimensions and quality, then download. If the image had to be downscaled, confirm it still meets any minimum pixel requirement.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I compress a photo to exactly 50 KB?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Select the 50 KB preset or type 50 into the target field, then compress. The tool searches for the highest quality whose encoded size still fits under 50 KB, and reports the exact result.",
          },
        },
        {
          "@type": "Question",
          name: "Why can a tool not always reach a very small size?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "File size depends on how much detail an image contains. A large, detailed photo has a floor below which it cannot be encoded and remain recognisable. When that floor is above your target, the tool reports what it achieved instead of returning a file over the limit.",
          },
        },
        {
          "@type": "Question",
          name: "Does compressing to a size change the image dimensions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Only when it has to. Quality reduction is tried first. If the smallest sensible quality still exceeds your target, the pixel dimensions are reduced as well, and the tool tells you that this happened.",
          },
        },
        {
          "@type": "Question",
          name: "Are my photos uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Compression runs in your browser using HTML5 Canvas. You can load the page, disconnect from the internet, and it still works.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://utilbyte.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Image Tools",
          item: "https://utilbyte.app/image-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Compress to Target Size",
          item: "https://utilbyte.app/image-tools/compress-to-size",
        },
      ],
    },
  ],
};

export default function CompressToSizePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressToSize />
    </>
  );
}

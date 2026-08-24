import DocumentPhoto from "@/components/tools/image/DocumentPhoto";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passport & Document Photo Maker - Exact Size and KB Limit | UtilByte",
  description:
    "Crop and size a photo to passport, visa or exam specifications. US visa 600x600 under 240KB, UK passport, 35x45mm and custom sizes. Free, runs in your browser, no upload.",
  keywords: [
    "passport size photo maker",
    "document photo resizer",
    "visa photo 600x600 240kb",
    "dv lottery photo size",
    "35x45mm photo online",
    "exam form photo resize",
    "passport photo online free",
    "signature resize for form",
    "id photo maker browser",
  ],
  openGraph: {
    title: "Passport & Document Photo Maker",
    description:
      "Crop to a document specification, hit the exact pixel size and stay under the KB limit. Nothing leaves your browser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport & Document Photo Maker",
    description:
      "Exact dimensions and file size for passport, visa and exam photos. Free and private.",
  },
  alternates: {
    canonical: "/image-tools/document-photo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Document & Passport Photo Maker",
      url: "https://utilbyte.app/image-tools/document-photo",
      description:
        "Browser-based tool that crops a photograph to a document specification, outputs the exact required pixel dimensions and compresses to fit a stated file size limit.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and HTML5 Canvas",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Fixed aspect ratio cropping with zoom and pan",
        "Presets verified against issuing authority specifications",
        "Custom pixel dimensions and size caps",
        "Compression to a maximum file size without changing dimensions",
        "Client-side processing, no upload",
      ],
    },
    {
      "@type": "HowTo",
      name: "How to make a passport or document photo online",
      description:
        "Crop a photograph to the required shape, produce it at the exact pixel dimensions, and get it under the file size limit.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add your photograph",
          text: "Use a photo taken against a plain, evenly lit background from a couple of metres away. Nothing is uploaded.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Choose the specification",
          text: "Pick a preset such as US visa 600 x 600, or enter the exact pixel dimensions and size cap your form states.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Position your face",
          text: "Drag to reposition and use the zoom slider until your head and shoulders fill the frame as the specification requires.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Create and check",
          text: "Generate the photo, confirm the reported dimensions and file size match the requirement, then download.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What size is a US visa or Diversity Visa photo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Square, between 600 x 600 and 1200 x 1200 pixels, in JPEG format, 240 kilobytes or less, in colour at 24 bits per pixel in sRGB, with a compression ratio of 20:1 or lower. This is published by the US Department of State.",
          },
        },
        {
          "@type": "Question",
          name: "What are the UK digital passport photo requirements?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "At least 600 pixels wide and 750 pixels tall, with a file size between 50 KB and 10 MB, taken against a plain light-coloured background, in colour, in focus and unedited.",
          },
        },
        {
          "@type": "Question",
          name: "Can a tool guarantee my document photo will be accepted?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Dimensions and file size can be checked mechanically, but head position, background uniformity, expression and lighting are judged by the issuing authority. Always read the current official requirements before submitting.",
          },
        },
        {
          "@type": "Question",
          name: "Is my photo uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Cropping and compression run entirely in your browser using HTML5 Canvas. The page continues to work with the network disconnected.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Image Tools",
          item: "https://utilbyte.app/image-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Document Photo Maker",
          item: "https://utilbyte.app/image-tools/document-photo",
        },
      ],
    },
  ],
};

export default function DocumentPhotoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocumentPhoto />
    </>
  );
}

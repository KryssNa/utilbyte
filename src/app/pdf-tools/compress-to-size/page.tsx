import PDFCompressToSize from "@/components/tools/pdf/PDFCompressToSize";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF to a Target Size - 500KB, 1MB, 2MB | UtilByte",
  description:
    "Compress a PDF to an exact size limit. Choose lossless restructuring that keeps the text, or rasterising that hits any target. Runs in your browser, no upload, free.",
  keywords: [
    "compress pdf to size",
    "compress pdf to 1mb",
    "compress pdf to 500kb",
    "reduce pdf size to specific size",
    "pdf size reducer online",
    "compress pdf for upload form",
    "shrink pdf to email limit",
  ],
  openGraph: {
    title: "Compress PDF to a Target Size",
    description:
      "State a size limit and choose what you are willing to trade for it. Everything runs in your browser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF to an Exact Size",
    description: "For portals that cap uploads at 1MB or 2MB. Free, private, browser-based.",
  },
  alternates: { canonical: "/pdf-tools/compress-to-size" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Compress PDF to Target Size",
      url: "https://utilbyte.app/pdf-tools/compress-to-size",
      description:
        "Browser-based PDF compressor that reduces a document to a stated file size, either losslessly or by rasterising pages.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Target an exact file size",
        "Lossless restructuring that preserves the text layer",
        "Optional rasterising with automatic quality search",
        "Selectable render resolution",
        "Client-side processing, no upload",
      ],
    },
    {
      "@type": "HowTo",
      name: "How to compress a PDF to a specific file size",
      description:
        "Reduce a PDF to fit an upload limit, choosing whether to preserve the text layer.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add your PDF",
          text: "Drop the file onto the page. Nothing is uploaded.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Set the limit",
          text: "Pick a preset such as 1 MB or type the exact figure the portal asks for.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Choose the trade-off",
          text: "Lossless restructuring keeps the text selectable. Rasterising reaches almost any target but turns the pages into images.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Check and download",
          text: "Confirm the reported size, and if you rasterised, keep your original.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why will my scanned PDF not compress losslessly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Because a scanned PDF is made of images, and lossless restructuring only removes metadata, unused objects and revision history. Re-encoding embedded images is not something a browser PDF library can do, so the only way to shrink a scan substantially is to rasterise it.",
          },
        },
        {
          "@type": "Question",
          name: "What does rasterising a PDF destroy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The text layer. After rasterising, the pages are images: text cannot be selected or searched, screen readers cannot read it, and links, bookmarks and form fields are gone. The change is not reversible.",
          },
        },
        {
          "@type": "Question",
          name: "How do I compress a PDF to under 1MB?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Set the target to 1024 KB and try lossless restructuring first. If that is not enough, rasterise at 144 dpi or lower, or split the document into several files if the portal caps each file rather than the total.",
          },
        },
        {
          "@type": "Question",
          name: "Is my PDF uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Both strategies run in your browser using pdf-lib and PDF.js. The page continues to work with the network disconnected.",
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
          name: "PDF Tools",
          item: "https://utilbyte.app/pdf-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Compress to Target Size",
          item: "https://utilbyte.app/pdf-tools/compress-to-size",
        },
      ],
    },
  ],
};

export default function PDFCompressToSizePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PDFCompressToSize />
    </>
  );
}

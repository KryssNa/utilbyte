import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { webpToPngArticle } from "@/content/tools/webp-to-png";
import { FORMAT_PAIRS } from "@/lib/format-pairs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebP to PNG Converter - Free, No Upload | UtilByte",
  description: "Convert WebP images to PNG in your browser. Lossless, keeps transparency, no upload. Includes when PNG is the wrong choice and JPG would be far smaller.",
  keywords: ["webp to png", "convert webp to png", "webp to png converter", "webp converter free", "open webp file", "webp to png online no upload", "save webp as png"],
  openGraph: {
    title: "WebP to PNG Converter",
    description: "Convert WebP to PNG losslessly, in your browser. Nothing is uploaded.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebP to PNG - Free Converter",
    description: "Convert WebP images to PNG. Lossless, keeps transparency, free.",
  },
  alternates: { canonical: "/image-tools/webp-to-png" },
};

const pair = FORMAT_PAIRS["webp-to-png"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `Convert ${pair.label}`,
      url: "https://utilbyte.app/image-tools/webp-to-png",
      description: "Convert WebP images to PNG in your browser. Lossless, keeps transparency, no upload. Includes when PNG is the wrong choice and JPG would be far smaller.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and HTML5 Canvas",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        `Convert ${pair.sourceLabel} to ${pair.targetLabel}`,
        "Client-side processing, no upload",
        "Clear reporting when the browser cannot decode the source",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Should I convert my WebP photo to PNG or JPG?",
          acceptedAnswer: { "@type": "Answer", text: "For a photograph, JPG. PNG is lossless and compresses continuous tone very badly, so a photo can become five to ten times larger with no visible improvement. Choose PNG for screenshots, logos, diagrams, or anything with transparency." },
        },
        {
          "@type": "Question",
          name: "Does converting to PNG improve the image quality?",
          acceptedAnswer: { "@type": "Answer", text: "No. Most WebP on the web is lossy, and PNG preserves exactly what the WebP decoder produced, artefacts included. A conversion can preserve or degrade; it never restores detail that was already discarded." },
        },
        {
          "@type": "Question",
          name: "What happens to an animated WebP?",
          acceptedAnswer: { "@type": "Answer", text: "You get the first frame only. PNG has no widely supported animation, so the movement is lost. If you need it, GIF is the compatible option, though it is much larger and limited to 256 colours per frame." },
        },
        {
          "@type": "Question",
          name: "Is transparency preserved?",
          acceptedAnswer: { "@type": "Answer", text: "Yes. PNG has a full alpha channel, so transparent areas in the WebP come through intact." },
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
          name: `Convert ${pair.label}`,
          item: "https://utilbyte.app/image-tools/webp-to-png",
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FormatPairConverter
        pair={pair}
        article={webpToPngArticle}
      relatedTools={[
        {
          title: "Format Converter",
          description: "Convert between any of the common image formats",
          href: "/image-tools/format-converter",
          category: "image",
        },
        {
          title: "Compress to Size",
          description: "Hit an exact KB limit after converting",
          href: "/image-tools/compress-to-size",
          category: "image",
        },
        {
          title: "Resize Image",
          description: "Change the pixel dimensions",
          href: "/image-tools/resize-image",
          category: "image",
        },
      ]}
        faqs={[
        {
          question: "Should I convert my WebP photo to PNG or JPG?",
          answer:
            "For a photograph, JPG. PNG is lossless and compresses continuous tone very badly, so a photo can become five to ten times larger with no visible improvement. Choose PNG for screenshots, logos, diagrams, or anything with transparency.",
        },
        {
          question: "Does converting to PNG improve the image quality?",
          answer:
            "No. Most WebP on the web is lossy, and PNG preserves exactly what the WebP decoder produced, artefacts included. A conversion can preserve or degrade; it never restores detail that was already discarded.",
        },
        {
          question: "What happens to an animated WebP?",
          answer:
            "You get the first frame only. PNG has no widely supported animation, so the movement is lost. If you need it, GIF is the compatible option, though it is much larger and limited to 256 colours per frame.",
        },
        {
          question: "Is transparency preserved?",
          answer:
            "Yes. PNG has a full alpha channel, so transparent areas in the WebP come through intact.",
        },
        ]}
      />
    </>
  );
}

import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { avifToJpgArticle } from "@/content/tools/avif-to-jpg";
import { FORMAT_PAIRS } from "@/lib/format-pairs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVIF to JPG Converter - Free, No Upload | UtilByte",
  description: "Convert AVIF images to JPG in your browser. Free, nothing uploaded, and clear about what the conversion costs in file size, bit depth and colour.",
  keywords: ["avif to jpg", "avif to jpeg converter", "convert avif to jpg", "open avif file", "avif converter free", "avif to jpg online no upload"],
  openGraph: {
    title: "AVIF to JPG Converter",
    description: "Convert AVIF images to JPG in your browser. Free and private.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVIF to JPG - Free Converter",
    description: "Convert AVIF to JPG in your browser. Free, no upload.",
  },
  alternates: { canonical: "/image-tools/avif-to-jpg" },
};

const pair = FORMAT_PAIRS["avif-to-jpg"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `Convert ${pair.label}`,
      url: "https://utilbyte.app/image-tools/avif-to-jpg",
      description: "Convert AVIF images to JPG in your browser. Free, nothing uploaded, and clear about what the conversion costs in file size, bit depth and colour.",
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
          name: "Why can I not open AVIF files in my software?",
          acceptedAnswer: { "@type": "Answer", text: "AVIF is recent. Browsers adopted it quickly, but desktop applications, older operating systems and upload forms lag well behind. Converting to JPG is the pragmatic fix when something else refuses the format." },
        },
        {
          "@type": "Question",
          name: "Why is the JPG so much bigger than the AVIF?",
          acceptedAnswer: { "@type": "Answer", text: "AVIF uses AV1 intra-frame compression and typically reaches the same visual quality in about half the bytes of a JPEG. Converting gives up roughly thirty years of codec progress, so the file about doubles." },
        },
        {
          "@type": "Question",
          name: "What is lost converting AVIF to JPG?",
          acceptedAnswer: { "@type": "Answer", text: "Transparency, which JPEG cannot carry. Bit depth, dropping from 10 or 12 bits to 8, which can cause banding in smooth gradients. And HDR and wide-gamut colour, so the result usually looks flatter than the original." },
        },
        {
          "@type": "Question",
          name: "The conversion failed. What is wrong?",
          acceptedAnswer: { "@type": "Answer", text: "Almost always an out-of-date browser. AVIF decoding has been available in Chrome since 2020, Firefox since 2021 and Safari since version 16 in 2022, so updating fixes it." },
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
          item: "https://utilbyte.app/image-tools/avif-to-jpg",
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
        article={avifToJpgArticle}
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
          question: "Why can I not open AVIF files in my software?",
          answer:
            "AVIF is recent. Browsers adopted it quickly, but desktop applications, older operating systems and upload forms lag well behind. Converting to JPG is the pragmatic fix when something else refuses the format.",
        },
        {
          question: "Why is the JPG so much bigger than the AVIF?",
          answer:
            "AVIF uses AV1 intra-frame compression and typically reaches the same visual quality in about half the bytes of a JPEG. Converting gives up roughly thirty years of codec progress, so the file about doubles.",
        },
        {
          question: "What is lost converting AVIF to JPG?",
          answer:
            "Transparency, which JPEG cannot carry. Bit depth, dropping from 10 or 12 bits to 8, which can cause banding in smooth gradients. And HDR and wide-gamut colour, so the result usually looks flatter than the original.",
        },
        {
          question: "The conversion failed. What is wrong?",
          answer:
            "Almost always an out-of-date browser. AVIF decoding has been available in Chrome since 2020, Firefox since 2021 and Safari since version 16 in 2022, so updating fixes it.",
        },
        ]}
      />
    </>
  );
}

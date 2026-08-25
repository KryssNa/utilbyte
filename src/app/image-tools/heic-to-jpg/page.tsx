import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { heicToJpgArticle } from "@/content/tools/heic-to-jpg";
import { FORMAT_PAIRS } from "@/lib/format-pairs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter - Free, No Upload | UtilByte",
  description: "Convert iPhone HEIC photos to JPG in your browser. Works in Safari; if your browser cannot decode HEIC we tell you, and show you the phone setting that fixes it for good.",
  keywords: ["heic to jpg", "heic to jpeg converter", "convert heic to jpg", "iphone heic to jpg", "open heic on windows", "heic converter free", "heic to jpg online no upload"],
  openGraph: {
    title: "HEIC to JPG Converter",
    description: "Convert iPhone HEIC photos to JPG. Runs in your browser, and honest about which browsers can actually do it.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEIC to JPG - Free Converter",
    description: "Convert iPhone photos to JPG in your browser. Free, no upload.",
  },
  alternates: { canonical: "/image-tools/heic-to-jpg" },
};

const pair = FORMAT_PAIRS["heic-to-jpg"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `Convert ${pair.label}`,
      url: "https://utilbyte.app/image-tools/heic-to-jpg",
      description: "Convert iPhone HEIC photos to JPG in your browser. Works in Safari; if your browser cannot decode HEIC we tell you, and show you the phone setting that fixes it for good.",
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
          name: "Why did the conversion fail in Chrome?",
          acceptedAnswer: { "@type": "Answer", text: "Chrome, Firefox and Edge cannot decode HEIC, because the format relies on patent-encumbered HEVC and they have not licensed a decoder. Safari can. This is a browser limitation and no web page can work around it without either shipping a large WebAssembly decoder or uploading your photo to a server." },
        },
        {
          "@type": "Question",
          name: "How do I stop my iPhone making HEIC files?",
          acceptedAnswer: { "@type": "Answer", text: "Settings, then Camera, then Formats, then Most Compatible. The camera captures JPEG from then on. Existing photos stay HEIC, but the problem stops recurring. The cost is disk space, since JPEG files are roughly twice the size." },
        },
        {
          "@type": "Question",
          name: "Why is the JPG bigger than the HEIC?",
          acceptedAnswer: { "@type": "Answer", text: "HEIC uses a much more modern codec and reaches the same visual quality in roughly half the bytes. Converting to JPEG gives up that efficiency, so the file typically about doubles." },
        },
        {
          "@type": "Question",
          name: "What is lost when converting HEIC to JPG?",
          acceptedAnswer: { "@type": "Answer", text: "Depth maps used for Portrait mode, the extra frames of a Live Photo, HDR gain maps and any editing history. The visible photograph is preserved; everything HEIC could carry alongside it is not." },
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
          item: "https://utilbyte.app/image-tools/heic-to-jpg",
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
        article={heicToJpgArticle}
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
          question: "Why did the conversion fail in Chrome?",
          answer:
            "Chrome, Firefox and Edge cannot decode HEIC, because the format relies on patent-encumbered HEVC and they have not licensed a decoder. Safari can. This is a browser limitation and no web page can work around it without either shipping a large WebAssembly decoder or uploading your photo to a server.",
        },
        {
          question: "How do I stop my iPhone making HEIC files?",
          answer:
            "Settings, then Camera, then Formats, then Most Compatible. The camera captures JPEG from then on. Existing photos stay HEIC, but the problem stops recurring. The cost is disk space, since JPEG files are roughly twice the size.",
        },
        {
          question: "Why is the JPG bigger than the HEIC?",
          answer:
            "HEIC uses a much more modern codec and reaches the same visual quality in roughly half the bytes. Converting to JPEG gives up that efficiency, so the file typically about doubles.",
        },
        {
          question: "What is lost when converting HEIC to JPG?",
          answer:
            "Depth maps used for Portrait mode, the extra frames of a Live Photo, HDR gain maps and any editing history. The visible photograph is preserved; everything HEIC could carry alongside it is not.",
        },
        ]}
      />
    </>
  );
}

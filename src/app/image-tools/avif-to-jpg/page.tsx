import { createToolMetadata } from "@/lib/tool-metadata";
import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { avifToJpgArticle } from "@/content/tools/avif-to-jpg";
import { FORMAT_PAIRS } from "@/lib/format-pairs";

export const metadata = createToolMetadata("/image-tools/avif-to-jpg", {
  title: "AVIF to JPG Converter - Free, No Upload",
  description: "Convert AVIF images to JPG in your browser. Free, nothing uploaded, and clear about what the conversion costs in file size, bit depth and colour.",
  keywords: ["avif to jpg", "avif to jpeg converter", "convert avif to jpg", "open avif file", "avif converter free", "avif to jpg online no upload"],
});

const pair = FORMAT_PAIRS["avif-to-jpg"];

export default function Page() {
  return (
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
            "Support depends on the application and file. JPEG can be useful when the receiving application accepts it but does not accept AVIF. Check the destination’s supported formats before converting.",
        },
        {
          question: "Why is the JPG so much bigger than the AVIF?",
          answer:
            "JPEG and AVIF use different compression methods. JPEG output may be larger depending on the original encoding, dimensions and selected quality. Compare the actual file sizes; there is no fixed multiplier.",
        },
        {
          question: "What is lost converting AVIF to JPG?",
          answer:
            "JPEG does not preserve transparency. The browser decodes the source and the tool exports a JPEG, so metadata, auxiliary information, color and fine detail may change. This is not an archival conversion; retain the original and inspect the output.",
        },
        {
          question: "The conversion failed. What is wrong?",
          answer:
            "Your browser must decode the particular AVIF file. Unsupported variants, corrupt input and device memory limits can cause failure. Try a current compatible browser or a smaller file; updating alone does not guarantee success.",
        },
        ]}
      />

  );
}

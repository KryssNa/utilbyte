import { createToolMetadata } from "@/lib/tool-metadata";
import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { webpToPngArticle } from "@/content/tools/webp-to-png";
import { FORMAT_PAIRS } from "@/lib/format-pairs";

export const metadata = createToolMetadata("/image-tools/webp-to-png", {
  title: "WebP to PNG Converter - Free, No Upload",
  description: "Convert a browser-decodable WebP image to PNG while preserving transparency. Runs locally; the output may be larger and does not restore lost image detail.",
  keywords: ["webp to png", "convert webp to png", "webp to png converter", "webp converter free", "open webp file", "webp to png online no upload", "save webp as png"],
});

const pair = FORMAT_PAIRS["webp-to-png"];

export default function Page() {
  return (
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
            "Choose PNG when transparency or lossless encoding of the decoded pixels matters. JPEG may produce a smaller photographic image when transparency is unnecessary, but adds lossy compression. Compare results using the intended destination’s format requirements.",
        },
        {
          question: "Does converting to PNG improve the image quality?",
          answer:
            "No. PNG can preserve decoded pixels without adding lossy compression, but cannot restore details already missing from the source. Browser decoding and color handling can still affect the displayed result.",
        },
        {
          question: "What happens to an animated WebP?",
          answer:
            "This converter writes a single static PNG from the browser-decoded image; it does not export an animation. Keep the original or use a tool that explicitly preserves animation if you need movement.",
        },
        {
          question: "Is transparency preserved?",
          answer:
            "PNG supports an alpha channel, and this converter keeps transparency from the decoded image. Review the output if the original uses animation, unusual color profiles or other features beyond a static image.",
        },
        ]}
      />

  );
}

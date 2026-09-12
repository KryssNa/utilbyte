import { createToolMetadata } from "@/lib/tool-metadata";
import FormatPairConverter from "@/components/tools/image/FormatPairConverter";
import { heicToJpgArticle } from "@/content/tools/heic-to-jpg";
import { FORMAT_PAIRS } from "@/lib/format-pairs";

export const metadata = createToolMetadata("/image-tools/heic-to-jpg", {
  title: "HEIC to JPG Converter - Free, No Upload",
  description: "Convert a HEIC photo to JPG when your browser can decode it. Processing stays in the browser, with a clear error if the format or file is unsupported.",
  keywords: ["heic to jpg", "heic to jpeg converter", "convert heic to jpg", "iphone heic to jpg", "open heic on windows", "heic converter free", "heic to jpg online no upload"],
});

const pair = FORMAT_PAIRS["heic-to-jpg"];

export default function Page() {
  return (
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
          question: "Why could my browser not convert the HEIC file?",
          answer:
            "This converter uses your browser’s image decoder. HEIC support varies by browser, operating system and file. Try a compatible browser or export a JPEG from your photo application. Corrupt files and insufficient device memory can also cause failure.",
        },
        {
          question: "How do I stop my iPhone making HEIC files?",
          answer:
            "On an iPhone with this option, open Settings, Camera, Formats and choose Most Compatible for future captures. Existing files are unchanged. Available formats depend on camera settings and device features; JPEG files can be larger.",
        },
        {
          question: "Why is the JPG bigger than the HEIC?",
          answer:
            "The codecs use different compression methods. JPEG output size depends on the source, dimensions and quality setting, so it may be larger or smaller. Compare the actual result; there is no fixed size multiplier.",
        },
        {
          question: "What is lost when converting HEIC to JPG?",
          answer:
            "The converter exports a decoded image as JPEG. It does not preserve the original HEIC container, auxiliary images, editing history or metadata. Color and detail may change during decoding and lossy JPEG encoding; review the result and retain the original.",
        },
        ]}
      />

  );
}

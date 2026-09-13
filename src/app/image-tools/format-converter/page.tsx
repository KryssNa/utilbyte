import { createToolMetadata } from "@/lib/tool-metadata";
import FormatConverter from "@/components/tools/image/FormatConverter";

export const metadata = createToolMetadata("/image-tools/format-converter", {
  title: "Convert Image Format Online Free - JPG PNG WebP GIF Converter",
  description: "Convert browser-decodable images to JPG, PNG or WebP with format and quality controls. Processing runs locally; accepted inputs depend on browser decoding support.",
  keywords: [
    "convert image format online free",
    "jpg to png converter",
    "png to jpg converter",
    "webp to jpg converter",
    "image format converter online",
    "convert png to jpg",
    "convert jpg to png",
    "gif converter online",
    "photo format converter",
    "batch image converter"
  ],
});

export default function FormatConverterPage() {
  return (
    <FormatConverter />

  );
}


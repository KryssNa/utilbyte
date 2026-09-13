import { createToolMetadata } from "@/lib/tool-metadata";
import BlurImage from "@/components/tools/image/BlurImage";

export const metadata = createToolMetadata("/image-tools/blur-image", {
  title: "Blur Image Online Free - Gaussian Blur & Pixelate Effects",
  description: "Apply blur or pixelation to an image or selected region in your browser. Preview the result before download; blurring is not a guarantee that sensitive details cannot be inferred.",
  keywords: [
    "blur image online free",
    "gaussian blur online",
    "pixelate image online",
    "blur photo online",
    "mosaic effect online",
    "blur background",
    "privacy blur",
    "image blur tool",
    "photo blur effect",
    "pixelate photo",
    "blur image for privacy"
  ],
});

export default function BlurImagePage() {
  return (
    <BlurImage />

  );
}


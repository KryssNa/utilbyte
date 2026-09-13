import { createToolMetadata } from "@/lib/tool-metadata";
import ImageBackgroundRemover from "@/components/tools/image/ImageBackgroundRemover";

export const metadata = createToolMetadata("/image-tools/remove-background", {
  title: "Remove a Solid Background Online Free - No Upload",
  description:
    "Remove a plain or solid background from an image by colour, with an adjustable tolerance. Best for product shots, logos and studio backdrops. Free, runs in your browser, no upload.",
  keywords: [
    "remove background online free",
    "remove image background",
    "transparent background maker",
    "remove photo background",
    "background eraser online",
    "cut out image background",
    "transparent background tool",
    "remove background from photo"
  ],
});

export default function RemoveBackgroundPage() {
  return (
    <ImageBackgroundRemover />

  );
}

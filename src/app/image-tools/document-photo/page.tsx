import { createToolMetadata } from "@/lib/tool-metadata";
import DocumentPhoto from "@/components/tools/image/DocumentPhoto";

export const metadata = createToolMetadata("/image-tools/document-photo", {
  title: "Passport & Document Photo Maker - Exact Size and KB Limit",
  description: "Crop and resize a photo with document presets or custom dimensions. Review the result against the receiving authority’s current requirements; acceptance is not guaranteed.",
  keywords: [
    "passport size photo maker",
    "document photo resizer",
    "visa photo 600x600 240kb",
    "dv lottery photo size",
    "35x45mm photo online",
    "exam form photo resize",
    "passport photo online free",
    "signature resize for form",
    "id photo maker browser",
  ],
});

export default function DocumentPhotoPage() {
  return (
    <DocumentPhoto />

  );
}

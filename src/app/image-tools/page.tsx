import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Tools - Compress, Resize, Convert & Edit Images",
  description:
    "Free image tools to compress, resize, convert, blur, crop, remove backgrounds, and extract text from images directly in your browser.",
  alternates: { canonical: "/image-tools" },
};

export default function ImageToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="Image"
      badgeLabel="Image Tools"
      heading="All Image Tools"
      description="Fast browser-based tools to optimize and edit images without uploading your files."
      accentClassName="border-sky-500/30 bg-sky-500/10 text-sky-400"
    />
  );
}

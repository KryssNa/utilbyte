import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Tools - Compress Video, Extract Audio, Convert to GIF",
  description:
    "Free browser-based video tools to compress videos, extract audio, and convert clips to GIFs with privacy-first local processing.",
  alternates: { canonical: "/video-tools" },
};

export default function VideoToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="Video"
      badgeLabel="Video Tools"
      heading="All Video Tools"
      description="Convert and optimize video files directly in your browser."
      accentClassName="border-orange-500/30 bg-orange-500/10 text-orange-400"
    />
  );
}

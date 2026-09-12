import { createToolMetadata } from "@/lib/tool-metadata";
import VideoToGif from "@/components/tools/video/VideoToGif";

export const metadata = createToolMetadata("/video-tools/video-to-gif", {
  title: "Video to GIF Converter Online Free - Convert Video to Animated GIF",
  description:
    "Convert video to GIF online for free. Create animated GIFs from video clips with customizable quality, size, frame rate, and duration. Perfect for social media and memes.",
  keywords: [
    "video to gif converter online free",
    "convert video to animated gif",
    "video to gif maker",
    "animated gif creator online",
    "video clip to gif converter",
    "mp4 to gif converter",
    "avi to gif converter",
    "create gif from video",
    "video to gif extractor",
    "online gif maker from video",
    "video to gif converter free",
    "animated gif from video clip"
  ],
});

export default function VideoToGifPage() {
  return (
    <VideoToGif />

  );
}

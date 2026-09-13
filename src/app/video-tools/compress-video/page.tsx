import { createToolMetadata } from "@/lib/tool-metadata";
import VideoCompressor from "@/components/tools/video/VideoCompressor";

export const metadata = createToolMetadata("/video-tools/compress-video", {
  title: "Video Compressor Online Free - Reduce MP4 AVI MOV File Size",
  description: "Re-encode video with quality, resolution and bitrate settings in your browser. Smaller files can lose detail; codec support and memory requirements vary.",
  keywords: [
    "video compressor online free",
    "compress video file size",
    "reduce video size online",
    "mp4 video compressor",
    "avi video compressor",
    "mov video compressor",
    "video compression tool",
    "video file optimizer",
    "reduce video bitrate",
    "video resolution converter",
    "online video shrinker",
    "video quality reducer"
  ],
});

export default function VideoCompressorPage() {
  return (
    <VideoCompressor />

  );
}

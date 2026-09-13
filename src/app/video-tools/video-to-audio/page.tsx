import { createToolMetadata } from "@/lib/tool-metadata";
import VideoToAudio from "@/components/tools/video/VideoToAudio";

export const metadata = createToolMetadata("/video-tools/video-to-audio", {
  title: "Video to Audio Converter Online Free - Extract MP3 WAV from Video",
  description: "Extract a video’s audio track using browser-based FFmpeg and choose an output format. Codec support and memory requirements vary by source file and device.",
  keywords: [
    "video to audio converter online free",
    "extract audio from video online",
    "video to mp3 converter",
    "convert video to wav online",
    "mp4 to mp3 converter online",
    "avi to mp3 converter",
    "mov to mp3 converter",
    "extract audio track from video",
    "video audio extractor online",
    "convert video to audio free",
    "online video to audio converter",
    "video to audio download"
  ],
});

export default function VideoToAudioPage() {
  return (
    <VideoToAudio />

  );
}

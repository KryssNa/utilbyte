import VideoToAudio from "@/components/tools/video/VideoToAudio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video to Audio Converter Online Free - Extract MP3 WAV from Video",
  description:
    "Convert video to audio online for free. Extract MP3, WAV, AAC, OGG, M4A from MP4, AVI, MOV, MKV videos. High-quality audio extraction, fast processing.",
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
  openGraph: {
    title: "Video to Audio Converter Online Free - Extract Audio",
    description: "Convert video to audio online for free. Extract MP3, WAV, AAC from MP4, AVI, MOV videos with high quality.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video to Audio Converter Online Free - MP3 Extractor",
    description: "Extract audio from video online for free. Convert MP4, AVI, MOV to MP3, WAV, AAC with high quality.",
  },
  alternates: {
    canonical: "/video-tools/video-to-audio",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Video to Audio Converter Online Free",
        "description": "Convert video to audio online for free. Extract MP3, WAV, AAC, OGG, M4A from MP4, AVI, MOV, MKV videos. High-quality audio extraction, fast processing.",
        "url": "https://utilbyte.app/video-tools/video-to-audio",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple audio formats",
          "Video format support",
          "High-quality extraction",
          "Batch processing",
          "Audio format conversion",
          "Fast extraction"
        ],
        "screenshot": "https://utilbyte.app/images/video-to-audio-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What audio formats can I extract?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Extract audio as MP3, WAV, AAC, OGG, M4A, and other popular audio formats from your video files."
            }
          },
          {
            "@type": "Question",
            "name": "Does the conversion maintain audio quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we maintain high audio quality during extraction. You can also choose different quality settings for compression."
            }
          },
          {
            "@type": "Question",
            "name": "Can I extract audio from multiple videos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our batch processing feature allows you to extract audio from multiple video files simultaneously."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Video to Audio Converter Online",
        "description": "Extract audio from video files online for free. Convert MP4, AVI, MOV videos to MP3, WAV, AAC audio formats instantly.",
        "thumbnailUrl": "https://utilbyte.app/images/video-to-audio-thumbnail.jpg",
        "uploadDate": "2024-01-01",
        "duration": "PT1M45S",
        "contentUrl": "https://utilbyte.app/video-tools/video-to-audio",
        "embedUrl": "https://utilbyte.app/video-tools/video-to-audio",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/WatchAction",
          "userInteractionCount": 10000
        },
        "author": {
          "@type": "Organization",
          "name": "UtilByte",
          "url": "https://utilbyte.app"
        },
        "publisher": {
          "@type": "Organization",
          "name": "UtilByte"
        }
      }
    ];

export default function VideoToAudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoToAudio />
    </>
  );
}

import VideoCompressor from "@/components/tools/video/VideoCompressor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Compressor Online Free - Reduce MP4 AVI MOV File Size",
  description:
    "Compress video files online for free. Reduce MP4, AVI, MOV, MKV file sizes with quality control, resolution adjustment, and bitrate optimization. Fast compression without quality loss.",
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
  openGraph: {
    title: "Video Compressor Online Free - Reduce File Size",
    description: "Compress MP4, AVI, MOV videos online for free. Reduce file sizes with quality control and resolution adjustment.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Compressor Online Free - MP4 AVI MOV",
    description: "Compress video files online for free. Reduce MP4, AVI, MOV file sizes with quality control and fast processing.",
  },
  alternates: {
    canonical: "/video-tools/compress-video",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Video Compressor Online Free",
        "description": "Compress video files online for free. Reduce MP4, AVI, MOV, MKV file sizes with quality control, resolution adjustment, and bitrate optimization. Fast compression without quality loss.",
        "url": "https://utilbyte.app/video-tools/compress-video",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple video formats",
          "Quality and size control",
          "Resolution adjustment",
          "Bitrate optimization",
          "Fast processing",
          "File size reduction"
        ],
        "screenshot": "https://utilbyte.app/images/compress-video-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Compress Video Files Online",
        "description": "Learn how to compress video files online while maintaining quality.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload video",
            "text": "Select and upload your MP4, AVI, MOV, or MKV video file."
          },
          {
            "@type": "HowToStep",
            "name": "Configure compression",
            "text": "Adjust quality settings, resolution, and output format."
          },
          {
            "@type": "HowToStep",
            "name": "Preview compression",
            "text": "See the estimated file size reduction before processing."
          },
          {
            "@type": "HowToStep",
            "name": "Download compressed video",
            "text": "Process and download your compressed video file."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much can I reduce video file size?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Video compression can reduce file sizes by 50-90% depending on the original quality and chosen settings. Higher compression means smaller files but potentially lower quality."
            }
          },
          {
            "@type": "Question",
            "name": "What video formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Common formats like MP4, AVI, MOV, WMV, FLV, and others are supported. The output is typically optimized MP4 format."
            }
          },
          {
            "@type": "Question",
            "name": "Will video quality be significantly reduced?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quality loss depends on compression settings. Our tool balances file size and quality, and you can preview the result before downloading."
            }
          },
          {
            "@type": "Question",
            "name": "How long does video compression take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Processing time depends on video length and size. Short videos process quickly, while longer videos may take several minutes."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Video Compressor Online Free",
        "description": "Compress video files online for free. Reduce video file sizes by up to 90% while maintaining quality. Supports MP4, AVI, MOV and other formats.",
        "thumbnailUrl": "https://utilbyte.app/images/video-compress-thumbnail.jpg",
        "uploadDate": "2024-01-01",
        "duration": "PT2M0S",
        "contentUrl": "https://utilbyte.app/video-tools/compress-video",
        "embedUrl": "https://utilbyte.app/video-tools/compress-video",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/WatchAction",
          "userInteractionCount": 12000
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
    ])
  }
};

export default function VideoCompressorPage() {
  return <VideoCompressor />;
}

import VideoToGif from "@/components/tools/video/VideoToGif";
import { Metadata } from "next";

export const metadata: Metadata = {
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
  openGraph: {
    title: "Video to GIF Converter Online Free - Animated GIF Maker",
    description: "Convert video to animated GIF online for free. Create GIFs with customizable quality, size, and frame rate.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video to GIF Converter Online Free - GIF Maker",
    description: "Convert video to GIF online for free. Create animated GIFs from video clips with custom settings for social media.",
  },
  alternates: {
    canonical: "/video-tools/video-to-gif",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Video to GIF Converter Online Free",
        "description": "Convert video to GIF online for free. Create animated GIFs from video clips with customizable quality, size, frame rate, and duration. Perfect for social media and memes.",
        "url": "https://utilbyte.app/video-tools/video-to-gif",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Video to GIF conversion",
          "Customizable frame rate",
          "Size and quality control",
          "Duration selection",
          "Social media optimization",
          "High-quality output"
        ],
        "screenshot": "https://utilbyte.app/images/video-to-gif-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Convert Video to GIF Online",
        "description": "Learn how to create animated GIFs from video clips online.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select video clip",
            "text": "Upload or select the video clip you want to convert to GIF."
          },
          {
            "@type": "HowToStep",
            "name": "Choose time range",
            "text": "Select the start time and duration for your GIF clip."
          },
          {
            "@type": "HowToStep",
            "name": "Configure settings",
            "text": "Adjust frame rate, size, and quality for optimal results."
          },
          {
            "@type": "HowToStep",
            "name": "Generate GIF",
            "text": "Process and download your animated GIF file."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What video formats can I convert to GIF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can convert MP4, AVI, MOV, WMV, FLV, and most common video formats to animated GIF files."
            }
          },
          {
            "@type": "Question",
            "name": "Can I choose specific parts of the video?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can specify start and end times to convert only the portion of the video you want into a GIF."
            }
          },
          {
            "@type": "Question",
            "name": "How do I control GIF file size?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can adjust frame rate, resolution, and quality settings. Lower frame rates and smaller dimensions create smaller GIF files."
            }
          },
          {
            "@type": "Question",
            "name": "Will the GIF be optimized for web use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the GIFs are optimized for web use with efficient compression and color palette optimization for fast loading."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Video to GIF Converter Online",
        "description": "Convert video files to animated GIF format online for free. Extract clips from videos and create custom GIFs with adjustable quality and frame rate.",
        "thumbnailUrl": "https://utilbyte.app/images/video-to-gif-thumbnail.jpg",
        "uploadDate": "2024-01-01",
        "duration": "PT1M30S",
        "contentUrl": "https://utilbyte.app/video-tools/video-to-gif",
        "embedUrl": "https://utilbyte.app/video-tools/video-to-gif",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/WatchAction",
          "userInteractionCount": 15000
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

export default function VideoToGifPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoToGif />
    </>
  );
}

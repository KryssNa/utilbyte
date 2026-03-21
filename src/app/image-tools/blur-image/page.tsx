import BlurImage from "@/components/tools/image/BlurImage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blur Image Online Free - Gaussian Blur & Pixelate Effects",
  description:
    "Blur images online for free with gaussian blur, motion blur, or pixelate effects. Perfect for privacy protection, background blur, or artistic photo editing.",
  keywords: [
    "blur image online free",
    "gaussian blur online",
    "pixelate image online",
    "blur photo online",
    "mosaic effect online",
    "blur background",
    "privacy blur",
    "image blur tool",
    "photo blur effect",
    "pixelate photo",
    "blur image for privacy"
  ],
  openGraph: {
    title: "Blur Image Online Free - Gaussian & Pixelate Effects",
    description: "Apply gaussian blur, motion blur, or pixelate effects to images online for free. Perfect for privacy and artistic editing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blur Image Online Free - Privacy & Effects",
    description: "Blur or pixelate images online for free. Gaussian blur, mosaic effects for privacy protection and artistic editing.",
  },
  alternates: {
    canonical: "/image-tools/blur-image",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Blur Image Online Free",
        "description": "Apply gaussian blur, motion blur, or pixelate effects to images online for free. Perfect for privacy protection, background blur, or artistic photo editing.",
        "url": "https://utilbyte.app/image-tools/blur-image",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Gaussian blur effects",
          "Motion blur options",
          "Pixelate/mosaic effects",
          "Privacy protection tools",
          "Customizable blur intensity",
          "Real-time preview"
        ],
        "screenshot": "https://utilbyte.app/images/blur-image-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Blur Images Online for Privacy",
        "description": "Learn how to apply blur effects to images online for privacy protection and artistic purposes.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload your image",
            "text": "Select and upload the image you want to blur."
          },
          {
            "@type": "HowToStep",
            "name": "Choose blur type",
            "text": "Select from gaussian blur, motion blur, or pixelate effects."
          },
          {
            "@type": "HowToStep",
            "name": "Adjust settings",
            "text": "Customize blur intensity, radius, and effect parameters."
          },
          {
            "@type": "HowToStep",
            "name": "Apply and download",
            "text": "Apply the blur effect and download your processed image."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of blur effects are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer gaussian blur for smooth softening, motion blur for directional effects, and pixelate effects for mosaic-style blurring."
            }
          },
          {
            "@type": "Question",
            "name": "Can I control the blur intensity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can adjust blur radius, intensity, and other parameters to achieve your desired effect."
            }
          },
          {
            "@type": "Question",
            "name": "Is this good for privacy protection?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, blur effects are commonly used to obscure sensitive information in images for privacy and security purposes."
            }
          }
        ]
      }
    ];

export default function BlurImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlurImage />
    </>
  );
}


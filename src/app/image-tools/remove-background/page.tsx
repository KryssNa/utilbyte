import ImageBackgroundRemover from "@/components/tools/image/ImageBackgroundRemover";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove a Solid Background Online Free - No Upload",
  description:
    "Remove a plain or solid background from an image by colour, with an adjustable tolerance. Best for product shots, logos and studio backdrops. Free, runs in your browser, no upload.",
  keywords: [
    "remove background online free",
    "remove image background",
    "transparent background maker",
    "remove photo background",
    "background eraser online",
    "cut out image background",
    "transparent background tool",
    "remove background from photo"
  ],
  openGraph: {
    title: "Remove a Solid Background Online Free",
    description: "Remove a plain background by colour, with an adjustable tolerance. Best for product shots and logos. Free and private.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove a Solid Background Online Free",
    description: "Colour-based background remover for plain and studio backgrounds. Free, fast, nothing uploaded.",
  },
  alternates: {
    canonical: "/image-tools/remove-background",
  }
};


const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Background Remover",
    "description": "Remove a plain background by color with adjustable tolerance, connected-pixel removal and edge feathering. Results depend on the image.",
    "url": "https://utilbyte.app/image-tools/remove-background",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Color selection and automatic corner sampling",
      "Adjustable tolerance and feathering",
      "Connected background removal",
      "Transparent PNG output"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://utilbyte.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Image Tools",
        "item": "https://utilbyte.app/image-tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Background Remover",
        "item": "https://utilbyte.app/image-tools/remove-background"
      }
    ]
  }
];

export default function RemoveBackgroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageBackgroundRemover />
    </>
  );
}

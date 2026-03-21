import LoremIpsum from "@/components/tools/text/LoremIpsum";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator Online Free - Generate Placeholder Text Instantly",
  description:
    "Generate Lorem Ipsum placeholder text online for free. Create custom paragraphs, sentences, words with HTML tags. Perfect for designers, developers, and content creators.",
  keywords: [
    "lorem ipsum generator online free",
    "generate lorem ipsum text",
    "placeholder text generator",
    "dummy text online",
    "lorem ipsum paragraphs",
    "placeholder content creator",
    "design mockup text",
    "web design placeholder",
    "typography placeholder",
    "sample text generator",
    "filler text generator",
    "lorem ipsum html"
  ],
  openGraph: {
    title: "Lorem Ipsum Generator Online Free - Placeholder Text",
    description: "Generate Lorem Ipsum placeholder text online for free. Create paragraphs, sentences, words with HTML formatting.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator Online Free",
    description: "Generate Lorem Ipsum placeholder text online for free. Perfect for designers and developers creating mockups.",
  },
  alternates: {
    canonical: "/text-tools/lorem-ipsum",
  }
};


const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Lorem Ipsum Generator Online Free",
        "description": "Generate Lorem Ipsum placeholder text online for free. Create custom paragraphs, sentences, words with HTML tags. Perfect for designers, developers, and content creators.",
        "url": "https://utilbyte.app/text-tools/lorem-ipsum",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom paragraph generation",
          "Sentence and word options",
          "HTML tag wrapping",
          "Copy to clipboard",
          "Real-time generation",
          "Design placeholder text"
        ],
        "screenshot": "https://utilbyte.app/images/lorem-ipsum-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Lorem Ipsum text?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Lorem Ipsum is dummy text used as placeholder content in publishing, graphic design, and web development to demonstrate layouts."
            }
          },
          {
            "@type": "Question",
            "name": "Can I generate HTML-formatted Lorem Ipsum?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can wrap generated text in paragraph tags, headings, or other HTML elements for web development."
            }
          },
          {
            "@type": "Question",
            "name": "How many paragraphs can I generate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generate as many paragraphs as you need. There's no limit on the amount of Lorem Ipsum text you can create."
            }
          }
        ]
      }
    ];

export default function LoremIpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoremIpsum />
    </>
  );
}

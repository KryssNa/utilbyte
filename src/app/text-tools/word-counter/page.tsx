import WordCounter from "@/components/tools/text/WordCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter Online Free - Count Words, Characters, Reading Time",
  description:
    "Count words, characters, sentences, paragraphs online for free. Get reading time, speaking time estimates. Perfect for writers, students, bloggers, and content creators.",
  keywords: [
    "word counter online free",
    "count words online",
    "character counter online",
    "word count tool",
    "reading time calculator",
    "text statistics",
    "word counter with reading time",
    "character count tool",
    "sentence counter",
    "paragraph counter",
    "writing statistics",
    "content word count"
  ],
  openGraph: {
    title: "Word Counter Online Free - Words, Characters, Reading Time",
    description: "Count words, characters, sentences online for free. Get reading time estimates. Perfect for writers and content creators.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Counter Online Free - Writing Statistics",
    description: "Count words, characters, reading time online for free. Perfect tool for writers, students, and bloggers.",
  },
  alternates: {
    canonical: "/text-tools/word-counter",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Word Counter Online Free",
        "description": "Count words, characters, sentences, paragraphs online for free. Get reading time, speaking time estimates. Perfect for writers, students, bloggers, and content creators.",
        "url": "https://utilbyte.app/text-tools/word-counter",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Word and character counting",
          "Reading time estimation",
          "Speaking time calculation",
          "Sentence and paragraph count",
          "Real-time statistics"
        ],
        "screenshot": "https://utilbyte.app/images/word-counter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What statistics does the word counter provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Provides word count, character count (with/without spaces), sentence count, paragraph count, reading time, and speaking time estimates."
            }
          },
          {
            "@type": "Question",
            "name": "How is reading time calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Reading time is calculated at 200 words per minute, which is the average reading speed for adults."
            }
          },
          {
            "@type": "Question",
            "name": "Can I count words in different languages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the word counter works with text in any language as it counts spaces and punctuation to determine word boundaries."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Count Words in Text",
        "description": "Learn how to accurately count words, characters, and reading time in your documents.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter or paste text",
            "text": "Type your text directly or paste content from documents, emails, or websites."
          },
          {
            "@type": "HowToStep",
            "name": "View word count",
            "text": "See the total word count displayed instantly as you type."
          },
          {
            "@type": "HowToStep",
            "name": "Check additional statistics",
            "text": "Review character count, reading time, and other text metrics."
          },
          {
            "@type": "HowToStep",
            "name": "Set writing goals",
            "text": "Use the statistics to meet word count requirements or track writing progress."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "950",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "Word Counter",
          "description": "Online word counting and text analysis tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Word Counter Online",
        "description": "Count words, characters, and reading time in your text online for free. Perfect for writers, students, and content creators.",
        "url": "https://utilbyte.app/text-tools/word-counter",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Word count",
          "Character count",
          "Reading time estimation",
          "Line count",
          "Real-time updates",
          "Multi-language support"
        ],
        "screenshot": "https://utilbyte.app/images/word-counter-screenshot.jpg",
        "author": {
          "@type": "Organization",
          "name": "UtilByte"
        }
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
            "name": "Text Tools",
            "item": "https://utilbyte.app/text-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Word Counter",
            "item": "https://utilbyte.app/text-tools/word-counter"
          }
        ]
      }
    ])
  }
};

export default function WordCounterPage() {
  return <WordCounter />;
}

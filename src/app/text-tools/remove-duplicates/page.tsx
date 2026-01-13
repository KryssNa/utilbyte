import RemoveDuplicates from "@/components/tools/text/RemoveDuplicates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Duplicates Online Free - Remove Duplicate Lines & Words from Text",
  description:
    "Remove duplicate lines and words from text online for free. Clean up lists, remove repeated entries, get duplicate statistics. Perfect for data cleaning and text processing.",
  keywords: [
    "remove duplicates online free",
    "remove duplicate lines from text",
    "remove duplicate words",
    "text deduplication tool",
    "clean duplicate entries",
    "remove repeated text",
    "duplicate line remover",
    "text cleanup tool",
    "data deduplication",
    "list deduplication",
    "remove duplicate entries",
    "text processing tool"
  ],
  openGraph: {
    title: "Remove Duplicates Online Free - Clean Duplicate Text",
    description: "Remove duplicate lines and words from text online for free. Clean lists, remove repeated entries, get statistics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Duplicates Online Free - Text Cleanup",
    description: "Remove duplicate lines and words from text online for free. Perfect for data cleaning and list management.",
  },
  alternates: {
    canonical: "/text-tools/remove-duplicates",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Remove Duplicates Online Free",
        "description": "Remove duplicate lines and words from text online for free. Clean up lists, remove repeated entries, get duplicate statistics. Perfect for data cleaning and text processing.",
        "url": "https://utilbyte.app/text-tools/remove-duplicates",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Duplicate line removal",
          "Duplicate word detection",
          "Statistics reporting",
          "Case-sensitive options",
          "Batch processing",
          "Data cleaning"
        ],
        "screenshot": "https://utilbyte.app/images/remove-duplicates-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Remove Duplicate Lines from Text",
        "description": "Learn how to remove duplicate lines and entries from text files and lists.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Paste your text",
            "text": "Paste or type the text containing duplicates."
          },
          {
            "@type": "HowToStep",
            "name": "Choose removal options",
            "text": "Select whether to remove duplicate lines or words."
          },
          {
            "@type": "HowToStep",
            "name": "Configure sensitivity",
            "text": "Choose case-sensitive or case-insensitive matching."
          },
          {
            "@type": "HowToStep",
            "name": "Remove duplicates",
            "text": "Process the text and view duplicate statistics."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the duplicate removal work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The tool identifies and removes duplicate lines or entries. You can choose case-sensitive or case-insensitive matching and preserve the order of first occurrences."
            }
          },
          {
            "@type": "Question",
            "name": "What types of duplicates can be removed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can remove duplicate lines, words, or custom-delimited entries. It works with lists, CSV data, email addresses, and any text with repeating patterns."
            }
          },
          {
            "@type": "Question",
            "name": "Does it preserve the original order?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the tool keeps the first occurrence of each unique item and removes subsequent duplicates, maintaining the original sequence."
            }
          },
          {
            "@type": "Question",
            "name": "Can I process large amounts of text?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can process thousands of lines efficiently. The processing happens instantly in your browser with no size limitations."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "ratingValue": "4.6",
        "reviewCount": "780",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "Duplicate Remover",
          "description": "Free online duplicate text removal tool"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Remove Duplicates Online Free",
        "description": "Remove duplicate lines and entries from text online for free. Clean up lists, emails, and data with advanced deduplication algorithms.",
        "url": "https://utilbyte.app/text-tools/remove-duplicates",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Remove duplicate lines",
          "Case-sensitive/insensitive matching",
          "Preserve original order",
          "Large text processing",
          "Instant results",
          "Free to use"
        ],
        "screenshot": "https://utilbyte.app/images/remove-duplicates-screenshot.jpg",
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
            "name": "Remove Duplicates",
            "item": "https://utilbyte.app/text-tools/remove-duplicates"
          }
        ]
      }
    ])
  }
};

export default function RemoveDuplicatesPage() {
  return <RemoveDuplicates />;
}

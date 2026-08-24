import TimestampConverter from "@/components/tools/utility/TimestampConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timestamp Converter Online Free - Unix ISO 8601 UTC Date Converter",
  description:
    "Convert between timestamp formats online for free. Unix timestamp, ISO 8601, UTC, local time with date parsing and formatting. Perfect for developers and API work.",
  keywords: [
    "timestamp converter online free",
    "unix timestamp converter",
    "iso 8601 converter",
    "utc timestamp converter",
    "epoch timestamp converter",
    "date time converter",
    "timestamp to date",
    "date to timestamp",
    "api timestamp converter",
    "developer timestamp tool",
    "javascript timestamp",
    "python timestamp converter"
  ],
  openGraph: {
    title: "Timestamp Converter Online Free - Unix ISO UTC",
    description: "Convert between Unix timestamp, ISO 8601, UTC formats online for free. Perfect for developers and API work.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timestamp Converter Online Free - Developer Tool",
    description: "Convert Unix timestamps, ISO 8601, UTC dates online for free. Essential tool for developers and API testing.",
  },
  alternates: {
    canonical: "/utility-tools/timestamp",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Timestamp Converter Online Free",
        "description": "Convert between timestamp formats online for free. Unix timestamp, ISO 8601, UTC, local time with date parsing and formatting. Perfect for developers and API work.",
        "url": "https://utilbyte.app/utility-tools/timestamp",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Unix timestamp conversion",
          "ISO 8601 formatting",
          "UTC time handling",
          "Multiple timezone support",
          "Date parsing",
          "API timestamp formatting"
        ],
        "screenshot": "https://utilbyte.app/images/timestamp-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a Unix timestamp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (Unix epoch), representing a specific moment in time."
            }
          },
          {
            "@type": "Question",
            "name": "How do I convert Unix timestamp to date?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enter the Unix timestamp in seconds or milliseconds, and the tool will convert it to a human-readable date and time format."
            }
          },
          {
            "@type": "Question",
            "name": "What timezone does the converter use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The converter works with UTC by default but can display times in your local timezone and other major timezones worldwide."
            }
          }
        ]
      }
    ])
  }
};

export default function TimestampConverterPage() {
  return <TimestampConverter />;
}

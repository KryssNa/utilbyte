import CronParser from "@/components/tools/dev/CronParser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Parser Online Free - Parse Cron Expressions & Schedule Jobs",
  description:
    "Parse and validate cron expressions online for free. See next execution times, human-readable schedules, and validate cron syntax. Perfect for DevOps and scheduled tasks.",
  keywords: [
    "cron parser online free",
    "cron expression parser",
    "parse cron expression",
    "cron scheduler online",
    "cron job parser",
    "validate cron expression",
    "cron syntax checker",
    "next cron run time",
    "cron expression validator",
    "linux cron parser",
    "scheduled job parser",
    "cron expression tester"
  ],
  openGraph: {
    title: "Cron Parser Online Free - Parse Cron Expressions",
    description: "Parse and validate cron expressions online. See next execution times and validate cron syntax for scheduled jobs.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron Parser Online Free - Schedule Jobs",
    description: "Parse cron expressions online for free. Validate syntax, see next run times, perfect for DevOps and scheduled tasks.",
  },
  alternates: {
    canonical: "/dev-tools/cron-parser",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Cron Parser Online Free",
        "description": "Parse and validate cron expressions online for free. See next execution times, human-readable schedules, and validate cron syntax. Perfect for DevOps and scheduled tasks.",
        "url": "https://utilbyte.app/dev-tools/cron-parser",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Cron expression parsing",
          "Next execution times",
          "Human-readable schedules",
          "Syntax validation",
          "Multiple examples",
          "DevOps tooling"
        ],
        "screenshot": "https://utilbyte.app/images/cron-parser-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a cron expression?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A cron expression is a string consisting of six or seven fields separated by spaces. It represents a schedule for executing commands or scripts at specific times or intervals."
            }
          },
          {
            "@type": "Question",
            "name": "How do I read cron expressions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cron expressions follow the pattern: * * * * * *. Each asterisk represents: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6), and optional year."
            }
          },
          {
            "@type": "Question",
            "name": "Can I test my cron schedule?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, enter your cron expression and the tool will show you the next execution times and provide a human-readable description of the schedule."
            }
          },
          {
            "@type": "Question",
            "name": "What cron special characters are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Supports asterisks (*), commas (,), hyphens (-), and forward slashes (/) for specifying ranges, lists, and intervals in cron expressions."
            }
          }
        ]
      }
    ])
  }
};

export default function CronParserPage() {
  return <CronParser />;
}

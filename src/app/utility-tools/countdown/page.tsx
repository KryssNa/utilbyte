import CountdownTimer from "@/components/tools/utility/CountdownTimer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Timer Online Free - Productivity Timer with Sound Alerts",
  description:
    "Set countdown timers online for free with sound alerts and visual progress. Perfect for Pomodoro technique, meetings, study sessions, and productivity.",
  keywords: [
    "countdown timer online free",
    "productivity timer online",
    "pomodoro timer online",
    "focus timer with sound",
    "meeting countdown timer",
    "study timer online",
    "kitchen timer online",
    "timer app web",
    "online stopwatch",
    "productivity tool online",
    "focus session timer",
    "time management tool"
  ],
  openGraph: {
    title: "Countdown Timer Online Free - Productivity Tool",
    description: "Set countdown timers online for free with sound alerts. Perfect for Pomodoro, meetings, and productivity sessions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer Online Free - Focus Timer",
    description: "Countdown timer online with sound alerts. Perfect for productivity, Pomodoro technique, and time management.",
  },
  alternates: {
    canonical: "/utility-tools/countdown",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Countdown Timer Online Free",
        "description": "Set countdown timers online for free with sound alerts and visual progress. Perfect for Pomodoro technique, meetings, study sessions, and productivity.",
        "url": "https://utilbyte.app/utility-tools/countdown",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Custom timer durations",
          "Sound notifications",
          "Visual progress indicators",
          "Pomodoro technique support",
          "Meeting timers",
          "Productivity enhancement"
        ],
        "screenshot": "https://utilbyte.app/images/countdown-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Pomodoro Technique?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks to improve productivity and prevent burnout."
            }
          },
          {
            "@type": "Question",
            "name": "Does the timer work when the browser is minimized?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The timer continues running in the background, but sound notifications work best when the browser tab is active."
            }
          },
          {
            "@type": "Question",
            "name": "Can I set custom timer durations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can set any custom duration from seconds to hours, making it perfect for various productivity techniques and time management needs."
            }
          }
        ]
      }
    ])
  }
};

export default function CountdownTimerPage() {
  return <CountdownTimer />;
}

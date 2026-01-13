import UnitConverter from "@/components/tools/utility/UnitConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter Online Free - Length Weight Temperature Area Volume Converter",
  description:
    "Convert units of measurement online for free. Length, weight, temperature, area, volume, time, speed, pressure, energy conversions. Metric and imperial systems.",
  keywords: [
    "unit converter online free",
    "length unit converter",
    "weight converter online",
    "temperature converter celsius fahrenheit",
    "area converter square meters",
    "volume converter liters gallons",
    "metric to imperial converter",
    "imperial to metric converter",
    "measurement conversion calculator",
    "physics unit converter",
    "engineering unit converter",
    "scientific calculator units"
  ],
  openGraph: {
    title: "Unit Converter Online Free - Measurement Converter",
    description: "Convert between units of measurement online for free. Length, weight, temperature, area, volume conversions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter Online Free - Measurement Tool",
    description: "Convert units online for free. Length, weight, temperature, area, volume. Metric and imperial conversions.",
  },
  alternates: {
    canonical: "/utility-tools/unit-converter",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Unit Converter Online Free",
        "description": "Convert units of measurement online for free. Length, weight, temperature, area, volume, time, speed, pressure, energy conversions. Metric and imperial systems.",
        "url": "https://utilbyte.app/utility-tools/unit-converter",
        "applicationCategory": "Utility",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Multiple unit categories",
          "Metric and imperial systems",
          "Real-time conversion",
          "High precision calculations",
          "Easy unit switching"
        ],
        "screenshot": "https://utilbyte.app/images/unit-converter-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What unit conversions are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Supports length, weight, temperature, area, volume, time, speed, pressure, energy, and many other unit conversions between metric and imperial systems."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate are the conversions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All conversions use official conversion factors with high precision calculations, accurate to multiple decimal places."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert between any units?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can convert between any compatible units within the same category. For example, convert meters to feet, Celsius to Fahrenheit, etc."
            }
          }
        ]
      }
    ])
  }
};

export default function UnitConverterPage() {
  return <UnitConverter />;
}

import MarkdownRenderer from "@/components/tools/dev/MarkdownRenderer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Renderer Online Free - Live Preview & GitHub Flavored Markdown",
  description:
    "Render and preview Markdown online for free. Live preview, GitHub Flavored Markdown support, syntax highlighting, HTML export. Perfect for documentation and blogging.",
  keywords: [
    "markdown renderer online free",
    "markdown preview online",
    "github flavored markdown",
    "markdown to html converter",
    "live markdown editor",
    "markdown syntax highlighting",
    "markdown parser online",
    "github markdown preview",
    "markdown viewer online",
    "convert markdown to html",
    "markdown editor online",
    "documentation markdown"
  ],
  openGraph: {
    title: "Markdown Renderer Online Free - Live Preview",
    description: "Render Markdown online with live preview, GitHub Flavored Markdown support, and syntax highlighting.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Renderer Online Free - GitHub Flavored",
    description: "Preview Markdown online for free. Live preview, GitHub Flavored Markdown, syntax highlighting, HTML export.",
  },
  alternates: {
    canonical: "/dev-tools/markdown-renderer",
  },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Markdown Renderer Online Free",
        "description": "Render and preview Markdown online for free. Live preview, GitHub Flavored Markdown support, syntax highlighting, HTML export.",
        "url": "https://utilbyte.app/dev-tools/markdown-renderer",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Live Markdown preview",
          "GitHub Flavored Markdown support",
          "Syntax highlighting",
          "HTML export functionality",
          "Real-time rendering"
        ],
        "screenshot": "https://utilbyte.app/images/markdown-renderer-screenshot.jpg"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Markdown?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's widely used for documentation, README files, and blogging."
            }
          },
          {
            "@type": "Question",
            "name": "Does it support GitHub Flavored Markdown?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our Markdown renderer fully supports GitHub Flavored Markdown (GFM), including tables, task lists, strikethrough, and other GitHub-specific extensions."
            }
          },
          {
            "@type": "Question",
            "name": "Can I export the rendered HTML?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can export the rendered HTML output for use in web pages, documentation, or any HTML-compatible platform."
            }
          },
          {
            "@type": "Question",
            "name": "Is the preview updated in real-time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the preview updates in real-time as you type, giving you instant feedback on how your Markdown will render."
            }
          }
        ]
      }
    ])
  }
};

export default function MarkdownRendererPage() {
  return <MarkdownRenderer />;
}

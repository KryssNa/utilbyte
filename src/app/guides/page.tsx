import { GUIDES } from "@/content/guides";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides - File Sizes, Document Photos and Formats | UtilByte",
  description:
    "Practical guides on compressing images to a KB limit, document and passport photo specifications, PDF size, and image formats. Written to be useful, not to sell you anything.",
  keywords: [
    "image compression guide",
    "document photo requirements",
    "pdf size guide",
    "image format comparison",
    "form upload file size",
  ],
  alternates: { canonical: "/guides" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "UtilByte Guides",
  description:
    "Practical guides on file sizes, document photo specifications and image formats.",
  url: "https://utilbyte.app/guides",
  hasPart: GUIDES.map((guide) => ({
    "@type": "Article",
    headline: guide.metaTitle,
    description: guide.metaDescription,
    url: `https://utilbyte.app/guides/${guide.slug}`,
    datePublished: guide.published,
  })),
};

export default function GuidesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        <header className="border-b border-[rgb(var(--border))]">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Guides
              </div>
              <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                How to get files past the form
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Upload limits, document photo specifications, format choices. These are the
                questions the tools on this site exist to answer, explained properly rather
                than in three sentences of filler around an advert.
              </p>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold">{guide.title}</h2>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {guide.summary}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {guide.readingMinutes} min read
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

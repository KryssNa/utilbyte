/**
 * Long-form guides.
 *
 * These are not tool pages. Each one answers a question somebody typed into a
 * search box, and earns its place by being genuinely more useful than the
 * fifteen affiliate blogs competing for the same query. Every guide should link
 * to at least one tool that does the thing it describes, and every tool page
 * that has a relevant guide should link back.
 */

export interface GuideSection {
  heading: string;
  /** One string per paragraph. Markdown is deliberately not supported — keep it plain. */
  body: string[];
  bullets?: string[];
  /** Optional simple table. `rows` cells align to `columns`. */
  table?: {
    columns: string[];
    rows: string[][];
    caption?: string;
  };
  callout?: {
    tone: "info" | "warning";
    text: string;
  };
}

export interface GuideLink {
  label: string;
  href: string;
  description: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** Used for <title> and the H1. Keep under about 60 characters. */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** ISO date. Shown to readers and emitted in Article structured data. */
  published: string;
  updated?: string;
  /** Two or three sentences, shown on the index and used as the standfirst. */
  summary: string;
  readingMinutes: number;
  intro: string[];
  sections: GuideSection[];
  /** Tools on this site that actually do the thing described. */
  relatedTools: GuideLink[];
  relatedGuides?: string[];
  faqs?: { question: string; answer: string }[];
}

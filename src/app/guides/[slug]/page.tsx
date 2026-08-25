import GuideArticle from "@/components/guides/GuideArticle";
import { getGuide, GUIDES } from "@/content/guides";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const BASE_URL = "https://utilbyte.app";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) return { title: "Guide not found | UtilByte" };

  return {
    title: `${guide.metaTitle} | UtilByte`,
    description: guide.metaDescription,
    keywords: guide.keywords,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: "article",
      locale: "en_US",
      publishedTime: guide.published,
      modifiedTime: guide.updated ?? guide.published,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.metaTitle,
        description: guide.metaDescription,
        datePublished: guide.published,
        dateModified: guide.updated ?? guide.published,
        author: { "@type": "Organization", name: "UtilByte", url: BASE_URL },
        publisher: { "@type": "Organization", name: "UtilByte", url: BASE_URL },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/guides/${guide.slug}`,
        },
      },
      ...(guide.faqs && guide.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE_URL}/guides` },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: `${BASE_URL}/guides/${guide.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuideArticle guide={guide} />
    </>
  );
}

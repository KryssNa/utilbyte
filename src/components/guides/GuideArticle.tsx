import type { Guide } from "@/content/guides/types";
import { getGuide } from "@/content/guides";
import { AlertTriangle, ArrowRight, Clock, Info } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GuideArticle({ guide }: { guide: Guide }) {
  const related = (guide.relatedGuides ?? [])
    .map(getGuide)
    .filter((g): g is Guide => Boolean(g));

  return (
    <div className="min-h-screen">
      <header className="border-b border-[rgb(var(--border))]">
        <div className="container mx-auto px-4 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/guides"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← All guides
            </Link>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              {guide.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {guide.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {guide.readingMinutes} min read
              </span>
              <span>
                {guide.updated
                  ? `Updated ${formatDate(guide.updated)}`
                  : `Published ${formatDate(guide.published)}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {guide.intro.map((paragraph, i) => (
              <p key={i} className="text-[16px] leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl mb-4">
                {section.heading}
              </h2>

              <div className="space-y-4">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-[16px] leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 list-disc pl-5">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="text-[16px] leading-relaxed text-muted-foreground">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.table && (
                <figure className="mt-6">
                  <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
                    <table className="w-full text-sm">
                      <thead className="bg-[rgb(var(--muted))]/30">
                        <tr>
                          {section.table.columns.map((column) => (
                            <th
                              key={column}
                              scope="col"
                              className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i} className="border-t border-[rgb(var(--border))]">
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-3 text-muted-foreground align-top">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {section.table.caption && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {section.table.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {section.callout && (
                <div
                  className={
                    section.callout.tone === "warning"
                      ? "mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
                      : "mt-6 flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))]/20 p-4"
                  }
                >
                  {section.callout.tone === "warning" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  ) : (
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  )}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {section.callout.text}
                  </p>
                </div>
              )}
            </section>
          ))}

          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-14">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl mb-5">
                Common questions
              </h2>
              <div className="space-y-4">
                {guide.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5"
                  >
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl mb-5">
              Tools for this
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {guide.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{tool.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl mb-5">
                Related reading
              </h2>
              <div className="space-y-3">
                {related.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/guides/${other.slug}`}
                    className="block rounded-xl border border-[rgb(var(--border))] p-5 transition-colors hover:bg-[rgb(var(--muted))]/30"
                  >
                    <span className="font-medium">{other.title}</span>
                    <p className="mt-1 text-sm text-muted-foreground">{other.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}

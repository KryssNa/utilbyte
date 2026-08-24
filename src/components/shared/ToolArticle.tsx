import { AlertTriangle } from "lucide-react";

export interface ToolArticleSection {
  heading: string;
  /** One string per paragraph. */
  body: string[];
  bullets?: string[];
}

export interface ToolArticleExample {
  title: string;
  input: string;
  output: string;
  note?: string;
}

export interface ToolArticleContent {
  /** Opening paragraphs. Written for someone who landed here from a search. */
  intro: string[];
  sections?: ToolArticleSection[];
  example?: ToolArticleExample;
  /** What the tool genuinely cannot do. Being honest here is the point. */
  limitations?: string[];
}

interface ToolArticleProps {
  content: ToolArticleContent;
  toolName: string;
}

/**
 * Editorial content for a tool page.
 *
 * This is the publisher content the page needs to be worth landing on — and,
 * separately, the thing Google's inventory-value policy requires before a
 * screen can carry ads. It must be materially different per tool; a shared
 * template with the format name swapped in is worse than nothing.
 */
export default function ToolArticle({ content, toolName }: ToolArticleProps) {
  const { intro, sections = [], example, limitations = [] } = content;

  return (
    <section className="border-t border-[rgb(var(--border))]">
      <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <article className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl mb-6">
            About the {toolName}
          </h2>

          <div className="space-y-4">
            {intro.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h3 className="text-lg font-semibold mb-3">{section.heading}</h3>
              <div className="space-y-4">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 list-disc pl-5">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {example && (
            <div className="mt-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
              <h3 className="text-lg font-semibold mb-4">{example.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Input
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-[rgb(var(--muted))]/40 p-3 text-xs leading-relaxed">
                    <code>{example.input}</code>
                  </pre>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Output
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-[rgb(var(--muted))]/40 p-3 text-xs leading-relaxed">
                    <code>{example.output}</code>
                  </pre>
                </div>
              </div>
              {example.note && (
                <p className="mt-4 text-sm text-muted-foreground">{example.note}</p>
              )}
            </div>
          )}

          {limitations.length > 0 && (
            <div className="mt-10">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                What this tool will not do
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {limitations.map((limitation, i) => (
                  <li key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

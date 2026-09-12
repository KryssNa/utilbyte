"use client";

import ToolShell from "@/components/shared/ToolShell";
import ProcessingDisclosure from "@/components/shared/ProcessingDisclosure";
import { getTool } from "@/lib/tool-catalog";
import { cn } from "@/lib/utils";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import AdSlot from "@/components/shared/AdSlot";
import ToolArticle, { type ToolArticleContent } from "@/components/shared/ToolArticle";
import { getGuidesForTool } from "@/content/guides";
import { usePathname } from "next/navigation";

type CategoryType = "image" | "pdf" | "text" | "dev" | "utility" | "video";

const categoryColors: Record<CategoryType, {
  badge: string;
  icon: string;
  accent: string;
}> = {
  image: {
    badge: "bg-indigo-500/10 text-indigo-400",
    icon: "text-indigo-400",
    accent: "border-l-indigo-500",
  },
  pdf: {
    badge: "bg-red-500/10 text-red-400",
    icon: "text-red-400",
    accent: "border-l-red-500",
  },
  text: {
    badge: "bg-emerald-500/10 text-emerald-400",
    icon: "text-emerald-400",
    accent: "border-l-emerald-500",
  },
  dev: {
    badge: "bg-amber-500/10 text-amber-400",
    icon: "text-amber-400",
    accent: "border-l-amber-500",
  },
  utility: {
    badge: "bg-teal-500/10 text-teal-400",
    icon: "text-teal-400",
    accent: "border-l-teal-500",
  },
  video: {
    badge: "bg-purple-500/10 text-purple-400",
    icon: "text-purple-400",
    accent: "border-l-purple-500",
  },
};

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  category?: CategoryType;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  category?: CategoryType;
  categoryLabel?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  relatedTools?: RelatedTool[];
  faqs?: FAQ[];
  hasDraft?: boolean;
  isWorking?: boolean;
  /**
   * Editorial content for this tool. Rendered below the tool surface and above
   * the FAQ. Required before this page is allowed to carry an ad unit — see
   * AdSlot for why.
   */
  article?: ToolArticleContent;
  /**
   * AdSense ad unit ids. Both are ignored unless `article` is present, so a
   * page can never serve an ad without publisher content of its own.
   */
  adSlots?: { inArticle?: string; footer?: string };
}

export default function ToolLayout({
  title,
  description,
  category = "utility",
  categoryLabel,
  icon: Icon,
  children,
  relatedTools = [],
  faqs = [],
  isWorking = false,
  hasDraft,
  article,
  adSlots,
}: ToolLayoutProps) {
  const colors = categoryColors[category] || categoryColors.utility;
  // No publisher content on the screen means no ad on the screen. Not a style
  // choice — it is the inventory-value rule, and it is the thing that gets
  // tool sites rejected.
  const mayServeAds = Boolean(article);

  // Guides are the other half of the internal linking: a tool page should point
  // at the writing that explains it, and the guide points back. Resolved from
  // the route so no tool component has to remember to pass anything.
  const pathname = usePathname();
  const tool = getTool(pathname ?? "");
  const guides = getGuidesForTool(pathname ?? "");

  return (
    <ToolShell tool={tool} isWorking={isWorking} hasDraft={hasDraft}>
    <div className="min-h-screen">
      <header className="px-4 pb-2 pt-3 lg:px-6 lg:pt-4">
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="py-1 hover:text-foreground">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${category}-tools`} className="py-1 hover:text-foreground">{categoryLabel || `${category} tools`}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <div className="flex items-start gap-3">
          {Icon && <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colors.badge)}><Icon aria-hidden="true" className="h-5 w-5" /></div>}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          </div>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:ml-[52px] sm:mt-1">{description}</p>
        {tool && <ProcessingDisclosure tool={tool} />}
      </header>

      <section data-tool-workspace aria-label={`${title} workspace`} className="min-w-0 px-4 pb-6 pt-2 lg:px-6">
        {children}
      </section>

      <div className="tool-help">
      {/* Keep creating */}
      {relatedTools.length > 0 && (
        <section className="border-t border-border/70">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                Keep creating
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 min-[1440px]:grid-cols-3">
                {relatedTools.filter(tool => tool.href !== pathname).map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="group rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      {tool.icon && (
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            categoryColors[tool.category || "utility"]?.badge || "bg-muted"
                          )}
                        >
                          <tool.icon
                            className={cn(
                              "h-5 w-5",
                              categoryColors[tool.category || "utility"]?.icon ||
                              "text-muted-foreground"
                            )}
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {article && <ToolArticle content={article} toolName={title} />}

      {mayServeAds && adSlots?.inArticle && (
        <div className="container mx-auto px-4 lg:px-6">
          <AdSlot slot={adSlots.inArticle} variant="in-article" />
        </div>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="border-t border-border/70 bg-muted/20">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card">
                {faqs.map((faq, index) => (
                  <details key={index} className="px-4">
                    <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">{faq.question}</summary>
                    <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="border-t border-border/70 bg-muted/10">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Further reading
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {guides.slice(0, 4).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <span className="font-medium">{guide.title}</span>
                  <p className="mt-1.5 text-sm text-muted-foreground">{guide.summary}</p>
                  <span className="mt-3 inline-block text-xs text-muted-foreground">
                    {guide.readingMinutes} min read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {mayServeAds && adSlots?.footer && (
        <div className="container mx-auto px-4 lg:px-6">
          <AdSlot slot={adSlots.footer} variant="footer" />
        </div>
      )}

      </div>
    </div>
    </ToolShell>
  );
}


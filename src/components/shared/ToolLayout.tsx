"use client";

import ToolShell from "@/components/shared/ToolShell";
import ProcessingDisclosure from "@/components/shared/ProcessingDisclosure";
import { getTool } from "@/lib/tool-catalog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, LucideIcon, Shield, Zap } from "lucide-react";
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
  isWorking?: boolean; // When true, collapses the header
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
      {/* Header Section - Collapses when working */}
      <AnimatePresence mode="wait">
        {!isWorking ? (
          <motion.section
            key="expanded-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-[rgb(var(--border))]"
          >
            <div className="container mx-auto px-4 py-4 lg:px-8 lg:py-5">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Link href="/" className="py-2 hover:text-foreground">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href={`/${category}-tools`} className="py-2 hover:text-foreground">{categoryLabel || `${category} tools`}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{title}</span>
              </nav>

              {/* Title Area */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  {/* Category + Title */}
                  <div className="flex items-center gap-2 mb-2">
                    {Icon && (
                      <div className={cn("p-1.5 rounded-md", colors.badge)}>
                        <Icon className={cn("h-4 w-4", colors.icon)} />
                      </div>
                    )}
                    {categoryLabel && (
                      <span className={cn("text-[10px] font-medium uppercase tracking-wide", colors.icon)}>
                        {categoryLabel}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    {title}
                  </h1>
                  <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
                    {description}
                  </p>
                </div>

                {/* Trust Indicators - Minimal */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    <Link href="/privacy" className="underline underline-offset-2">Data & privacy</Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>No signup</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          /* Compact Header - When working on a file */
          <motion.section
            key="compact-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sticky top-[var(--header-height)] z-40 border-b border-[rgb(var(--border))] bg-background/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-2.5 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link href={`/${category}-tools`} aria-label={`Back to ${categoryLabel || category + " tools"}`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-muted">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className={cn("w-px h-5 bg-border")} />
                  {Icon && (
                    <div className={cn("p-1.5 rounded-md", colors.badge)}>
                      <Icon className={cn("h-4 w-4", colors.icon)} />
                    </div>
                  )}
                  <span className="font-medium text-sm">{title}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <div className="hidden sm:flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    <Link href="/privacy" className="underline underline-offset-2">Data & privacy</Link>
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Free to use</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Tool Area */}
      <section data-tool-workspace className="container mx-auto min-w-0 px-4 py-6 lg:px-8 lg:py-8">
        {tool && <ProcessingDisclosure tool={tool} />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </section>

      <div className="tool-help">
      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="border-t border-[rgb(var(--border))]">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl mb-8">
                Related Tools
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.filter(tool => tool.href !== pathname).map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 transition-all duration-200 hover:shadow-lg hover:border-[rgb(var(--primary))]/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {tool.icon && (
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            categoryColors[tool.category || "utility"]?.badge || "bg-[rgb(var(--muted))]"
                          )}
                        >
                          <tool.icon
                            className={cn(
                              "h-5 w-5",
                              categoryColors[tool.category || "utility"]?.icon ||
                              "text-[rgb(var(--muted-foreground))]"
                            )}
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium group-hover:text-[rgb(var(--primary))] transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-[rgb(var(--muted-foreground))]">{tool.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
      {article && <ToolArticle content={article} toolName={title} />}

      {mayServeAds && adSlots?.inArticle && (
        <div className="container mx-auto px-4 lg:px-8">
          <AdSlot slot={adSlots.inArticle} variant="in-article" />
        </div>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--muted))]/20">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl mb-8">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6"
                  >
                    <h3 className="font-semibold text-[rgb(var(--foreground))] mb-2">{faq.question}</h3>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--muted))]/10">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl mb-8">
              Further reading
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {guides.slice(0, 4).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 transition-all hover:border-[rgb(var(--primary))]/30 hover:shadow-lg"
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
        <div className="container mx-auto px-4 lg:px-8">
          <AdSlot slot={adSlots.footer} variant="footer" />
        </div>
      )}

      </div>
    </div>
    </ToolShell>
  );
}


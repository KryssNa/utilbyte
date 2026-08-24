"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, LucideIcon, Shield, Zap } from "lucide-react";
import Link from "next/link";

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
  isWorking?: boolean; // When true, collapses the header
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
}: ToolLayoutProps) {
  const colors = categoryColors[category] || categoryColors.utility;

  return (
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
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3 cursor-pointer">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Tools</span>
              </Link>

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
                    <span>Private</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Instant</span>
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
            className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-background/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-2.5 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link href="/">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
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
                    <span>Private</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Tool Area */}
      <section className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </section>

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
                {relatedTools.map((tool, index) => (
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
    </div>
  );
}


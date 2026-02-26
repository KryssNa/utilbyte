"use client";

import SocialProof from "@/components/shared/SocialProof";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toolCategories } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Search,
  Shield,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { toolIcons } from "@/components/layout/navbar/data";

const features = [
  { icon: Shield, title: "100% Private", color: "text-emerald-500 dark:text-emerald-400" },
  { icon: Zap, title: "Lightning Fast", color: "text-amber-500 dark:text-amber-400" },
  { icon: Clock, title: "No Sign-up", color: "text-cyan-500 dark:text-cyan-400" },
  { icon: Sparkles, title: "Always Free", color: "text-teal-500 dark:text-teal-400" },
];

const popularTools = [
  { title: "PDF Editor", href: "/pdf-tools/edit-pdf", desc: "Edit text, images, and annotations in any PDF", category: "PDF" },
  { title: "Image Compressor", href: "/image-tools/compress-image", desc: "Reduce file size without quality loss", category: "Image" },
  { title: "Online Compiler", href: "/dev-tools/online-compiler", desc: "Write and run code in 10+ languages", category: "Dev" },
  { title: "Merge PDF", href: "/pdf-tools/merge-pdf", desc: "Combine multiple PDFs into one", category: "PDF" },
  { title: "Background Remover", href: "/image-tools/remove-background", desc: "AI-powered background removal", category: "Image" },
  { title: "JSON Formatter", href: "/dev-tools/json-formatter", desc: "Format and validate JSON", category: "Dev" },
  { title: "QR Code", href: "/utility-tools/qr-code", desc: "Create QR codes instantly", category: "Utility" },
  { title: "Password Generator", href: "/utility-tools/password-generator", desc: "Generate secure passwords", category: "Utility" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

function getCategoryMeta(catTitle: string) {
  const cat = toolCategories.find((c) => c.title === catTitle);
  return { color: cat?.color ?? "text-muted-foreground", bg: cat?.bgColor ?? "bg-muted" };
}

const TOOLS_VISIBLE_DEFAULT = 10;

export default function HomePageClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toolSearch, setToolSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((catTitle: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catTitle)) next.delete(catTitle);
      else next.add(catTitle);
      return next;
    });
  }, []);

  const filteredCategories = useMemo(() => {
    if (!toolSearch.trim() && !activeCategory) return toolCategories;
    const q = toolSearch.toLowerCase();
    return toolCategories
      .filter((cat) => !activeCategory || cat.title === activeCategory)
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter(
          (t) => !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [toolSearch, activeCategory]);

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-background to-teal-100 dark:from-sky-950/40 dark:via-background dark:to-teal-950/30" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-400/15 dark:bg-sky-500/15 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[128px] animate-pulse-slow animation-delay-2000" />
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="container relative mx-auto px-4 py-16 lg:px-8 lg:py-28">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300 dark:border-sky-500/30 bg-sky-100 dark:bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {totalTools} Free Tools &middot; 100% Private
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-display font-bold text-4xl tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-foreground">Free Tools for</span>
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Everyday Work
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-5 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed">
              Image, PDF, text & developer tools.{" "}
              <span className="text-foreground font-medium">No sign-up. No uploads.</span>{" "}
              Everything runs in your browser.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 dark:from-sky-500 dark:to-teal-500 dark:hover:from-sky-600 dark:hover:to-teal-600 text-white shadow-lg shadow-sky-500/25">
                <a href="#tools">
                  Explore All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/image-tools/compress-image">Try Image Compressor</Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
                  <f.icon className={cn("h-4 w-4", f.color)} />
                  <span className="text-sm font-medium text-foreground">{f.title}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      </section>

      {/* Popular Tools */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Popular Tools</h2>
              <p className="text-sm text-muted-foreground">Most used tools by our community</p>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool, i) => {
              const Icon = toolIcons[tool.title] ?? Wrench;
              const { color, bg } = getCategoryMeta(tool.category);
              return (
                <motion.div key={tool.href} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                  <Link href={tool.href} className="group block">
                    <div className="relative rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110", bg)}>
                          <Icon className={cn("h-4 w-4", color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tool.desc}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section id="tools" className="scroll-mt-20 py-14 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">All {totalTools} Tools</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need, right in your browser. No downloads, no sign-ups.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setActiveCategory(null); setExpandedCategories(new Set()); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  !activeCategory ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              {toolCategories.map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => { setActiveCategory(activeCategory === cat.title ? null : cat.title); setExpandedCategories(new Set()); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    activeCategory === cat.title ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <cat.icon className="h-3 w-3" />
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {filteredCategories.map((category, catIdx) => (
              <motion.div
                key={category.title}
                id={category.title.toLowerCase().replace(/\s/g, "-") + "-tools"}
                className="scroll-mt-24"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: catIdx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn("p-2.5 rounded-xl", category.bgColor)}>
                    <category.icon className={cn("h-5 w-5", category.color)} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight">{category.title} Tools</h3>
                    <p className="text-xs text-muted-foreground">{category.tools.length} tools</p>
                  </div>
                </div>

                {(() => {
                  const isExpanded = expandedCategories.has(category.title) || !!toolSearch.trim();
                  const visibleTools = isExpanded ? category.tools : category.tools.slice(0, TOOLS_VISIBLE_DEFAULT);
                  const hasMore = category.tools.length > TOOLS_VISIBLE_DEFAULT;
                  return (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleTools.map((tool) => {
                          const Icon = toolIcons[tool.title] ?? Wrench;
                          return (
                            <Link key={tool.href} href={tool.href} className="group block">
                              <div className="relative rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                                <div className="flex items-start gap-3">
                                  <div className={cn("p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110", category.bgColor)}>
                                    <Icon className={cn("h-4 w-4", category.color)} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 shrink-0 mt-1" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      {hasMore && !toolSearch.trim() && (
                        <button
                          onClick={() => toggleCategory(category.title)}
                          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/showmore"
                        >
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
                          {isExpanded
                            ? "Show less"
                            : `Show ${category.tools.length - TOOLS_VISIBLE_DEFAULT} more`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium">No tools match your search</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different keyword or clear filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => { setToolSearch(""); setActiveCategory(null); setExpandedCategories(new Set()); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative rounded-3xl border border-border bg-gradient-to-br from-sky-500/5 via-transparent to-teal-500/5 dark:from-sky-500/10 dark:to-teal-500/10 p-8 lg:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[80px]" />

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 mb-5">
                  <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl mb-3">
                  Your Files Never Leave Your Device
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  All processing happens locally in your browser using modern web technologies.
                  Your files are never uploaded to any server.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
                  {["No server uploads", "No tracking", "No data collection"].map((text) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <SocialProof />
        </div>
      </section>
    </div>
  );
}

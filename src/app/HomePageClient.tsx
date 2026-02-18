'use client';

import SocialProof from "@/components/shared/SocialProof";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Binary,
  Braces,
  Clock,
  Code2,
  Crop,
  FileDown,
  FileImage,
  FileText,
  GitCompare,
  Hash,
  Image,
  Key,
  Merge,
  QrCode,
  RefreshCw,
  Shield,
  Sparkles,
  Type,
  Video,
  Wrench,
  Zap,
  Terminal,
  Search,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const stats = [
  { value: "50+", label: "Free Tools" },
  { value: "100%", label: "Browser-Based" },
  { value: "0", label: "Sign-ups Needed" },
  { value: "∞", label: "Uses Per Day" },
];

const features = [
  { icon: Shield, title: "100% Private", description: "Files never leave your device", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Zap, title: "Lightning Fast", description: "No uploads, instant results", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Clock, title: "No Sign-up", description: "Use immediately, zero friction", color: "text-sky-500", bg: "bg-sky-500/10" },
  { icon: Sparkles, title: "Always Free", description: "No hidden fees, forever", color: "text-rose-500", bg: "bg-rose-500/10" },
];

const toolCategories = [
  {
    id: "image-tools",
    title: "Image Tools",
    description: "Crop, compress, convert and edit images",
    icon: Image,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    accentColor: "sky",
    dotColor: "bg-sky-500",
    hoverGlow: "hover:shadow-sky-500/10",
    tools: [
      { title: "Image Cropper", desc: "Crop to any dimension", href: "/image-tools/crop-image", icon: Crop },
      { title: "Compressor", desc: "Reduce file size losslessly", href: "/image-tools/compress-image", icon: FileDown },
      { title: "Format Converter", desc: "PNG, JPG, WebP, AVIF", href: "/image-tools/format-converter", icon: RefreshCw },
      { title: "Background Remover", desc: "AI-powered removal", href: "/image-tools/remove-background", icon: Image },
      { title: "Image to Text", desc: "Extract text via OCR", href: "/image-tools/ocr", icon: Type },
    ],
  },
  {
    id: "pdf-tools",
    title: "PDF Tools",
    description: "Merge, split, compress and convert PDFs",
    icon: FileText,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    accentColor: "rose",
    dotColor: "bg-rose-500",
    hoverGlow: "hover:shadow-rose-500/10",
    tools: [
      { title: "Merge PDF", desc: "Combine multiple PDFs", href: "/pdf-tools/merge-pdf", icon: Merge },
      { title: "Compress PDF", desc: "Reduce size, keep quality", href: "/pdf-tools/compress-pdf", icon: FileDown },
      { title: "PDF to Image", desc: "Convert pages to images", href: "/pdf-tools/pdf-to-image", icon: FileImage },
      { title: "Image to PDF", desc: "Create PDF from images", href: "/pdf-tools/image-to-pdf", icon: FileText },
      { title: "Split PDF", desc: "Extract specific pages", href: "/pdf-tools/split-pdf", icon: FileText },
    ],
  },
  {
    id: "dev-tools",
    title: "Developer Tools",
    description: "JSON, Base64, regex, diff, UUID and more",
    icon: Code2,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    accentColor: "amber",
    dotColor: "bg-amber-500",
    hoverGlow: "hover:shadow-amber-500/10",
    tools: [
      { title: "JSON Formatter", desc: "Format & validate JSON", href: "/dev-tools/json-formatter", icon: Braces },
      { title: "Code Beautifier", desc: "HTML, CSS, JavaScript", href: "/dev-tools/code-beautifier", icon: Terminal },
      { title: "Diff Checker", desc: "Compare text & code", href: "/dev-tools/diff-checker", icon: GitCompare },
      { title: "Base64", desc: "Encode/decode Base64", href: "/dev-tools/base64", icon: Binary },
      { title: "JWT Decoder", desc: "Decode JWT tokens", href: "/dev-tools/jwt-decoder", icon: Key },
      { title: "UUID Generator", desc: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: Hash },
    ],
  },
  {
    id: "text-tools",
    title: "Text Tools",
    description: "Count, convert, format and clean text",
    icon: Type,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    accentColor: "emerald",
    dotColor: "bg-emerald-500",
    hoverGlow: "hover:shadow-emerald-500/10",
    tools: [
      { title: "Word Counter", desc: "Count words & characters", href: "/text-tools/word-counter", icon: Hash },
      { title: "Case Converter", desc: "Change text case instantly", href: "/text-tools/case-converter", icon: Type },
      { title: "Remove Duplicates", desc: "Clean duplicate lines", href: "/text-tools/remove-duplicates", icon: Type },
      { title: "Text Formatter", desc: "Format & clean text", href: "/text-tools/text-formatter", icon: Type },
      { title: "Lorem Ipsum", desc: "Generate placeholder text", href: "/text-tools/lorem-ipsum", icon: FileText },
    ],
  },
  {
    id: "utility-tools",
    title: "Utility Tools",
    description: "Passwords, QR codes, converters and more",
    icon: Wrench,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    accentColor: "cyan",
    dotColor: "bg-cyan-500",
    hoverGlow: "hover:shadow-cyan-500/10",
    tools: [
      { title: "Password Generator", desc: "Secure passwords", href: "/utility-tools/password-generator", icon: Key },
      { title: "QR Code", desc: "Create QR codes", href: "/utility-tools/qr-code", icon: QrCode },
      { title: "Color Converter", desc: "HEX, RGB, HSL", href: "/utility-tools/color-converter", icon: Sparkles },
      { title: "Unit Converter", desc: "Length, weight, temp", href: "/utility-tools/unit-converter", icon: RefreshCw },
    ],
  },
  {
    id: "video-tools",
    title: "Video Tools",
    description: "Convert, compress and extract from videos",
    icon: Video,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    accentColor: "orange",
    dotColor: "bg-orange-500",
    hoverGlow: "hover:shadow-orange-500/10",
    tools: [
      { title: "Video to Audio", desc: "Extract audio track", href: "/video-tools/video-to-audio", icon: Video },
      { title: "Video Compressor", desc: "Reduce video size", href: "/video-tools/compress-video", icon: FileDown },
      { title: "Video to GIF", desc: "Create animated GIFs", href: "/video-tools/video-to-gif", icon: Video },
    ],
  },
];

const popularTools = [
  { title: "JSON Formatter", href: "/dev-tools/json-formatter", icon: Braces, category: "Dev" },
  { title: "Image Compressor", href: "/image-tools/compress-image", icon: FileDown, category: "Image" },
  { title: "PDF Merger", href: "/pdf-tools/merge-pdf", icon: Merge, category: "PDF" },
  { title: "Password Generator", href: "/utility-tools/password-generator", icon: Key, category: "Utility" },
  { title: "Regex Tester", href: "/dev-tools/regex-tester", icon: Search, category: "Dev" },
  { title: "QR Code Generator", href: "/utility-tools/qr-code", icon: QrCode, category: "Utility" },
];

export default function HomePageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(245,158,11,0.06),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="container mx-auto px-4 lg:px-8 py-24 lg:py-0"
        >
          <div className="max-w-5xl mx-auto">
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/40 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                </span>
                50+ free tools, zero sign-up required
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-center font-bold text-5xl sm:text-6xl lg:text-[80px] tracking-tight leading-[1.05]"
            >
              <span className="text-foreground">Every tool</span>
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                you actually need.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Image, PDF, text & developer tools. Everything runs{" "}
              <span className="text-foreground font-semibold">100% in your browser</span>{" "}
              — no uploads, no tracking, no nonsense.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button asChild size="lg" className="h-12 px-7 text-base bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 font-semibold">
                <a href="#tools">
                  Browse all tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base font-medium">
                <Link href="/dev-tools/json-formatter">
                  Try JSON Formatter
                </Link>
              </Button>
            </motion.div>

            {/* Popular tools quick-links */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-muted-foreground mr-1">Popular:</span>
              {popularTools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:border-foreground/20 hover:bg-card transition-all duration-200"
                >
                  <t.icon className="h-3 w-3" />
                  {t.title}
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center justify-center py-6 px-4 text-center"
              >
                <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="mt-0.5 text-xs text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors duration-200"
              >
                <div className={cn("p-2 rounded-lg shrink-0", f.bg)}>
                  <f.icon className={cn("h-4 w-4", f.color)} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL TOOLS ── */}
      <section id="tools" className="scroll-mt-16 py-20">
        <div className="container mx-auto px-4 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-500 mb-2">All Tools</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Everything in one place.
              </h2>
              <p className="mt-2 text-muted-foreground max-w-lg">
                No installs, no accounts, no limits. Open a tool and get to work.
              </p>
            </div>
          </motion.div>

          <div className="space-y-16">
            {toolCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", category.bgColor)}>
                      <category.icon className={cn("h-5 w-5", category.color)} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/#${category.id}`}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Tool grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-foreground/10 hover:bg-card/80 hover:shadow-lg transition-all duration-200"
                    >
                      <div className={cn("p-2 rounded-lg shrink-0 transition-colors duration-200", category.bgColor)}>
                        <tool.icon className={cn("h-4 w-4 transition-colors duration-200", category.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-foreground leading-tight">{tool.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{tool.desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY BANNER ── */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-border bg-gradient-to-br from-emerald-500/5 via-card to-card overflow-hidden p-8 lg:p-12"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10">
                  <Shield className="h-7 w-7 text-emerald-500" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  Your files never touch our servers.
                </h2>
                <p className="mt-2 text-muted-foreground text-base max-w-2xl">
                  Every tool runs entirely in your browser. We never see, store or transmit your files. It's not a policy — it's how the code works.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  {["No server uploads", "No analytics on your data", "No accounts required", "Open in any browser"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <SocialProof />
        </div>
      </section>
    </div>
  );
}

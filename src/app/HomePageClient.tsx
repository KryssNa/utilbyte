'use client';

import SocialProof from "@/components/shared/SocialProof";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "Files never leave your device",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No uploads, instant results",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "No Sign-up",
    description: "Use immediately, zero friction",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Sparkles,
    title: "Always Free",
    description: "No hidden fees, forever",
    color: "text-fuchsia-500 dark:text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
  },
];

const toolCategories = [
  {
    id: "image-tools",
    title: "Image Tools",
    description: "Crop, compress, convert, and edit images instantly",
    icon: Image,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    tools: [
      { title: "Image Cropper", desc: "Crop images to perfect dimensions", href: "/image-tools/crop-image", icon: Crop },
      { title: "Image Compressor", desc: "Reduce file size without quality loss", href: "/image-tools/compress-image", icon: FileDown },
      { title: "Format Converter", desc: "Convert between PNG, JPG, WebP", href: "/image-tools/format-converter", icon: RefreshCw },
      { title: "Background Remover", desc: "Remove image backgrounds with AI", href: "/image-tools/remove-background", icon: Image },
      { title: "Image to Text", desc: "Extract text from images (OCR)", href: "/image-tools/ocr", icon: Type },
    ],
  },
  {
    id: "pdf-tools",
    title: "PDF Tools",
    description: "Merge, split, compress, and convert PDF files",
    icon: FileText,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    gradient: "from-rose-500/20 to-orange-500/20",
    tools: [
      { title: "Merge PDF", desc: "Combine multiple PDFs into one", href: "/pdf-tools/merge-pdf", icon: Merge },
      { title: "Compress PDF", desc: "Reduce PDF file size", href: "/pdf-tools/compress-pdf", icon: FileDown },
      { title: "PDF to Image", desc: "Convert PDF pages to images", href: "/pdf-tools/pdf-to-image", icon: FileImage },
      { title: "Image to PDF", desc: "Convert images to PDF", href: "/pdf-tools/image-to-pdf", icon: FileText },
    ],
  },
  {
    id: "text-tools",
    title: "Text Tools",
    description: "Count, convert, format, and clean text",
    icon: Type,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    gradient: "from-emerald-500/20 to-teal-500/20",
    tools: [
      { title: "Word Counter", desc: "Count words and characters", href: "/text-tools/word-counter", icon: Hash },
      { title: "Case Converter", desc: "Change text case instantly", href: "/text-tools/case-converter", icon: Type },
      { title: "Remove Duplicates", desc: "Remove duplicate lines", href: "/text-tools/remove-duplicates", icon: Type },
    ],
  },
  {
    id: "dev-tools",
    title: "Developer Tools",
    description: "JSON, Base64, UUID, and more for developers",
    icon: Code2,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    gradient: "from-amber-500/20 to-yellow-500/20",
    tools: [
      { title: "JSON Formatter", desc: "Format and validate JSON", href: "/dev-tools/json-formatter", icon: Braces },
      { title: "Base64", desc: "Encode/decode Base64", href: "/dev-tools/base64", icon: Binary },
      { title: "UUID Generator", desc: "Generate unique IDs", href: "/dev-tools/uuid-generator", icon: Hash },
      { title: "JWT Decoder", desc: "Decode JWT tokens", href: "/dev-tools/jwt-decoder", icon: Key },
    ],
  },
  {
    id: "video-tools",
    title: "Video Tools",
    description: "Convert, compress, and edit videos",
    icon: Video,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    gradient: "from-purple-500/20 to-pink-500/20",
    tools: [
      { title: "Video to Audio", desc: "Extract audio from video", href: "/video-tools/video-to-audio", icon: Video },
      { title: "Video Compressor", desc: "Compress video files", href: "/video-tools/compress-video", icon: FileDown },
      { title: "Video to GIF", desc: "Convert video to GIF", href: "/video-tools/video-to-gif", icon: Video },
    ],
  },
  {
    id: "utility-tools",
    title: "Utility Tools",
    description: "Passwords, QR codes, converters, and more",
    icon: Wrench,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    gradient: "from-cyan-500/20 to-blue-500/20",
    tools: [
      { title: "Password Generator", desc: "Generate secure passwords", href: "/utility-tools/password-generator", icon: Key },
      { title: "QR Code", desc: "Create QR codes instantly", href: "/utility-tools/qr-code", icon: QrCode },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function HomePageClient() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient - light mode friendly */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-background to-fuchsia-100 dark:from-violet-950/50 dark:via-background dark:to-fuchsia-950/30" />

          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-400/20 dark:bg-violet-500/20 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-400/15 dark:bg-fuchsia-500/15 rounded-full blur-[128px] animate-pulse-slow animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[128px] animate-pulse-slow animation-delay-4000" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                               linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />

          {/* Radial fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-32">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300 dark:border-violet-500/30 bg-violet-100 dark:bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                100% Free & Private
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold text-4xl tracking-tight sm:text-5xl lg:text-7xl"
            >
              <span className="text-foreground">Free Tools for</span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Everyday Work
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
            >
              Image, PDF, text & developer tools.{" "}
              <span className="text-foreground font-medium">No sign-up. No uploads.</span>{" "}
              Everything runs in your browser.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 dark:from-violet-500 dark:to-fuchsia-500 dark:hover:from-violet-600 dark:hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
              >
                <a href="#tools">
                  Explore All Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                <Link href="/image-tools/compress-image">
                  Try Image Compressor
                </Link>
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex flex-wrap items-center justify-center gap-3"
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm"
                >
                  <feature.icon className={cn("h-4 w-4", feature.color)} />
                  <span className="text-sm font-medium text-foreground">{feature.title}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Separator with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </section>

      {/* Tools Section */}
      <section id="tools" className="scroll-mt-20 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              All Tools
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need, right in your browser. No downloads, no sign-ups.
            </p>
          </motion.div>

          {/* Tool Categories */}
          <div className="space-y-20">
            {toolCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("p-3 rounded-2xl", category.bgColor)}>
                    <category.icon className={cn("h-6 w-6", category.color)} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative cursor-pointer"
                    >
                      <div className={cn(
                        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl",
                        category.gradient
                      )} />
                      <div className={cn(
                        "relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5",
                        "hover:border-white/[0.15] hover:bg-white/[0.04]",
                        "transition-all duration-300"
                      )}>
                        <div className="flex items-start gap-4">
                          <div className={cn("p-2.5 rounded-xl shrink-0", category.bgColor)}>
                            <tool.icon className={cn("h-5 w-5", category.color)} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[rgb(var(--foreground))] group-hover:text-white transition-colors">
                              {tool.title}
                            </h4>
                            <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))] line-clamp-2">
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-3xl border border-border bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 dark:from-violet-500/10 dark:to-fuchsia-500/10 p-8 lg:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-[80px]" />

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 mb-6">
                  <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl mb-4">
                  Your Files Never Leave Your Device
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  All processing happens locally in your browser using modern web technologies.
                  Your files are never uploaded to any server. Complete privacy, guaranteed.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    No server uploads
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    No tracking
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    No data collection
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <SocialProof />
        </div>
      </section>
    </div>
  );
}

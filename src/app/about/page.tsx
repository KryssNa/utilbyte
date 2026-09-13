import PageStructuredData from "@/components/shared/PageStructuredData";
import { withPageMetadata } from "@/lib/page-metadata";
import { catalog, catalogCategories } from "@/lib/tool-catalog";
import { Code2, FileText, Globe, Heart, Image, Lock, Shield, Sparkles, Target, Type, Users, Video, Wrench, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = withPageMetadata("/about", {
  title: "About Us",
  description: "Meet UtilByte: free tools for images, PDFs, text and developers. Local file processing, clearly disclosed network services, no sign-up, and open-source code.",
  keywords: "about utilbyte, free online tools, privacy first tools, browser based tools",
  openGraph: {
    title: "About Us | UtilByte",
    description: "Learn about UtilByte - free, privacy-first online tools for everyday work.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | UtilByte",
    description: "Learn about UtilByte - free, privacy-first online tools for everyday work.",
  },
  alternates: {
    canonical: "/about",
  },
});

const stats = [
  { number: String(catalog.length), label: "Free Tools", icon: Wrench },
  { number: String(catalogCategories.length), label: "Tool Categories", icon: Globe },
  { number: "0", label: "Accounts Required", icon: Lock },
  { number: "MIT", label: "Open Source", icon: Code2 },
];

const toolCategories = [
  { name: "Image Tools", count: catalog.filter(tool => tool.category === "Image").length, icon: Image, description: "Compress, crop, resize, convert formats, remove backgrounds, and more" },
  { name: "PDF Tools", count: catalog.filter(tool => tool.category === "PDF").length, icon: FileText, description: "Merge, split, compress, convert, and rotate PDF documents" },
  { name: "Text Tools", count: catalog.filter(tool => tool.category === "Text").length, icon: Type, description: "Word counter, case converter, text formatter, and more" },
  { name: "Dev Tools", count: catalog.filter(tool => tool.category === "Dev").length, icon: Code2, description: "JSON formatter, Base64, JWT decoder, hash generator, regex tester" },
  { name: "Utility Tools", count: catalog.filter(tool => tool.category === "Utility").length, icon: Wrench, description: "QR codes, barcodes, password generator, color converter" },
  { name: "Video Tools", count: catalog.filter(tool => tool.category === "Video").length, icon: Video, description: "Compress videos, extract audio, create GIFs" },
];

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Local file tools process on your device. Network tools and MCP explain where your data is sent before you choose to use them.",
  },
  {
    icon: Zap,
    title: "Fast & Free",
    description: "No sign-ups, no subscriptions, no hidden fees. Just fast, reliable tools available instantly.",
  },
  {
    icon: Sparkles,
    title: "Simple & Clean",
    description: "Intuitive interfaces designed for everyone. No learning curve, just get things done.",
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Whether you're a developer, designer, student, or professional, our tools are built for you.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageStructuredData route="/about" name={String(metadata.title)} description={metadata.description!} type="AboutPage" />
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-transparent to-violet-50/30 dark:to-violet-950/10">
        <div className="container mx-auto px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 mb-6">
              <Target className="h-4 w-4" />
              About Us
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Free Tools for{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                Everyone
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              UtilByte provides free tools for images, PDFs, text, code, and everyday tasks.
              No account is required. Local file tools process on your device; network tools explain where data is sent.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900">
                <Icon className="h-8 w-8 mx-auto text-violet-500 mb-3" />
                <p className="text-3xl font-bold text-foreground">{stat.number}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Our Mission */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <Target className="h-6 w-6 text-violet-500" />
              Our Mission
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                UtilByte was created with a simple mission: to provide high-quality, free online tools
                that respect your privacy. We believe that essential utilities should be accessible to everyone,
                without the need for expensive software subscriptions or concerns about data security.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Local image, PDF, text and video tools process selected files in your browser using
                canvas, pdf-lib and WebAssembly libraries. Some tools first download a runtime or model;
                offline availability depends on what has loaded and on browser support.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                API Client sends requests through a proxy. Request Catcher and Local Proxy use hosted
                request storage, while WebSocket Client connects directly to your chosen server.
                MCP text operations run on our server. Each tool explains its data handling; see our{" "}
                <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>{" "}
                for site analytics, advertising, feedback and service details.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <Heart className="h-6 w-6 text-violet-500" />
              Our Values
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="p-6 rounded-xl bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/20 dark:to-fuchsia-950/20 border border-violet-100 dark:border-violet-900">
                    <Icon className="h-8 w-8 text-violet-500 mb-4" />
                    <h3 className="font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <Wrench className="h-6 w-6 text-violet-500" />
              What We Offer
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              UtilByte provides a comprehensive suite of tools organized into categories to help you work more efficiently:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {toolCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.name} className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name} <span className="text-sm font-normal text-muted-foreground">({category.count} tools)</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <Zap className="h-6 w-6 text-violet-500" />
              How It Works
            </h2>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    Local processing, with clear exceptions
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                    Use the processing disclosure on each tool to see how it handles your input.
                    File tools run locally; network services and MCP have separate processing paths.
                  </p>
                  <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Local file transformations happen on your device
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Network destinations are disclosed on each tool
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Some tools download runtimes before processing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Review outputs and keep a copy of your originals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section>
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-200 dark:border-violet-800 rounded-xl p-8 text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We'd love to hear from you. Whether you have feedback, suggestions, or need help,
                don't hesitate to reach out.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

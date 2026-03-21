import { Code2, FileText, Globe, Heart, Image, Lock, Shield, Sparkles, Target, Type, Users, Video, Wrench, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | UtilByte",
  description: "Learn about UtilByte - free, privacy-first online tools for images, PDFs, text, and developers. No uploads, no sign-ups, 100% browser-based.",
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
};

const stats = [
  { number: "37+", label: "Free Tools", icon: Wrench },
  { number: "100%", label: "Browser-Based", icon: Globe },
  { number: "0", label: "Data Uploads", icon: Lock },
  { number: "24/7", label: "Available", icon: Zap },
];

const toolCategories = [
  { name: "Image Tools", count: 7, icon: Image, description: "Compress, crop, resize, convert formats, remove backgrounds, and more" },
  { name: "PDF Tools", count: 6, icon: FileText, description: "Merge, split, compress, convert, and rotate PDF documents" },
  { name: "Text Tools", count: 5, icon: Type, description: "Word counter, case converter, text formatter, and more" },
  { name: "Dev Tools", count: 9, icon: Code2, description: "JSON formatter, Base64, JWT decoder, hash generator, regex tester" },
  { name: "Utility Tools", count: 7, icon: Wrench, description: "QR codes, barcodes, password generator, color converter" },
  { name: "Video Tools", count: 3, icon: Video, description: "Compress videos, extract audio, create GIFs" },
];

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files never leave your device. All processing happens locally in your browser, ensuring complete privacy.",
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
              UtilByte provides free, privacy-focused online tools that work entirely in your browser.
              No uploads, no accounts, no compromise on your data.
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
              <p className="text-muted-foreground leading-relaxed">
                Every tool on UtilByte processes your data directly in your browser using modern web technologies.
                This means your files, images, and documents never leave your device — they're processed locally,
                ensuring maximum privacy and security.
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
                    100% Client-Side Processing
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                    Unlike many online tools that upload your files to remote servers, UtilByte processes
                    everything directly in your web browser using JavaScript and WebAssembly technologies.
                  </p>
                  <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Your files stay on your device
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      No data is sent to any server
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Works offline once loaded
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Maximum privacy and security
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

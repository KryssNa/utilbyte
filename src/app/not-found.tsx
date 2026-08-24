"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const popularTools = [
  { title: "Image Compressor", href: "/image-tools/compress-image" },
  { title: "PDF Merge", href: "/pdf-tools/merge-pdf" },
  { title: "JSON Formatter", href: "/dev-tools/json-formatter" },
  { title: "Word Counter", href: "/text-tools/word-counter" },
];

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-background to-fuchsia-100 dark:from-violet-950/50 dark:via-background dark:to-fuchsia-950/30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-400/20 dark:bg-violet-500/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-400/15 dark:bg-fuchsia-500/15 rounded-full blur-[128px] animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Illustration */}
          <motion.div
            className="relative mx-auto mb-8 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* SVG Illustration - Lost in Space theme */}
            <svg
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              {/* Stars */}
              <circle cx="50" cy="50" r="2" className="fill-violet-400 dark:fill-violet-300 animate-pulse" />
              <circle cx="350" cy="80" r="1.5" className="fill-fuchsia-400 dark:fill-fuchsia-300 animate-pulse animation-delay-2000" />
              <circle cx="100" cy="120" r="1" className="fill-cyan-400 dark:fill-cyan-300 animate-pulse" />
              <circle cx="300" cy="40" r="2" className="fill-violet-400 dark:fill-violet-300 animate-pulse animation-delay-4000" />
              <circle cx="380" cy="200" r="1.5" className="fill-fuchsia-400 dark:fill-fuchsia-300 animate-pulse" />
              <circle cx="30" cy="180" r="1" className="fill-cyan-400 dark:fill-cyan-300 animate-pulse animation-delay-2000" />
              <circle cx="250" cy="30" r="1.5" className="fill-violet-400 dark:fill-violet-300 animate-pulse" />
              <circle cx="150" cy="60" r="1" className="fill-fuchsia-400 dark:fill-fuchsia-300 animate-pulse animation-delay-4000" />

              {/* Planet */}
              <circle cx="200" cy="150" r="80" className="fill-violet-100 dark:fill-violet-900/50" />
              <ellipse cx="200" cy="150" rx="80" ry="20" className="fill-violet-200/50 dark:fill-violet-800/30" />
              <circle cx="180" cy="130" r="15" className="fill-violet-200 dark:fill-violet-800/50" />
              <circle cx="220" cy="160" r="10" className="fill-violet-200 dark:fill-violet-800/50" />
              <circle cx="170" cy="170" r="8" className="fill-violet-200 dark:fill-violet-800/50" />

              {/* Ring around planet */}
              <ellipse
                cx="200"
                cy="150"
                rx="120"
                ry="25"
                className="stroke-violet-300 dark:stroke-violet-600"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10 5"
              />

              {/* Astronaut floating */}
              <g className="animate-float" style={{ transformOrigin: "320px 100px" }}>
                {/* Body */}
                <ellipse cx="320" cy="110" rx="18" ry="22" className="fill-white dark:fill-slate-200" />
                {/* Helmet */}
                <circle cx="320" cy="85" r="16" className="fill-white dark:fill-slate-200" />
                <circle cx="320" cy="85" r="12" className="fill-violet-400 dark:fill-violet-500" />
                <ellipse cx="318" cy="83" rx="4" ry="3" className="fill-white/50" />
                {/* Backpack */}
                <rect x="338" y="95" width="10" height="20" rx="3" className="fill-slate-300 dark:fill-slate-400" />
                {/* Arms */}
                <ellipse cx="298" cy="105" rx="8" ry="5" className="fill-white dark:fill-slate-200" transform="rotate(-30 298 105)" />
                <ellipse cx="342" cy="108" rx="8" ry="5" className="fill-white dark:fill-slate-200" transform="rotate(20 342 108)" />
                {/* Legs */}
                <ellipse cx="312" cy="135" rx="5" ry="10" className="fill-white dark:fill-slate-200" transform="rotate(-10 312 135)" />
                <ellipse cx="328" cy="135" rx="5" ry="10" className="fill-white dark:fill-slate-200" transform="rotate(10 328 135)" />
              </g>

              {/* Floating tools/icons */}
              <g className="animate-float animation-delay-2000" style={{ transformOrigin: "80px 200px" }}>
                <rect x="65" y="190" width="30" height="22" rx="3" className="fill-rose-400 dark:fill-rose-500" />
                <rect x="68" y="193" width="10" height="3" rx="1" className="fill-white/50" />
                <rect x="68" y="198" width="15" height="2" rx="1" className="fill-white/30" />
                <rect x="68" y="202" width="12" height="2" rx="1" className="fill-white/30" />
              </g>

              <g className="animate-float animation-delay-4000" style={{ transformOrigin: "70px 80px" }}>
                <rect x="55" y="70" width="28" height="20" rx="2" className="fill-emerald-400 dark:fill-emerald-500" />
                <circle cx="69" cy="80" r="6" className="fill-white/30" />
              </g>

              {/* 404 Text */}
              <text
                x="200"
                y="270"
                textAnchor="middle"
                className="fill-violet-600 dark:fill-violet-400 text-6xl font-bold"
                style={{ fontSize: '48px', fontFamily: 'var(--font-display)' }}
              >
                404
              </text>
            </svg>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              Lost in Space?
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              The page you&apos;re looking for has drifted into the cosmos.
              Let&apos;s get you back to familiar territory.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="h-12 px-6">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <Link href="/#tools">
                  <Search className="mr-2 h-4 w-4" />
                  Browse All Tools
                </Link>
              </Button>
            </div>

            {/* Popular Tools */}
            <div className="border-t border-border pt-8">
              <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Or try one of our popular tools
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {popularTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-3 w-3 rotate-[135deg]" />
                    {tool.title}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


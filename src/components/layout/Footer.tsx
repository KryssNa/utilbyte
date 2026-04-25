import { Code2, FileText, GitFork, Github, Heart, Image, Shield, Sparkles, Star, Type, Video, Wrench } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  "Image Tools": [
    { title: "Image Compressor", href: "/image-tools/compress-image" },
    { title: "Image Cropper", href: "/image-tools/crop-image" },
    { title: "Resize Image", href: "/image-tools/resize-image" },
    { title: "Format Converter", href: "/image-tools/format-converter" },
    { title: "Background Remover", href: "/image-tools/remove-background" },
    { title: "Blur Image", href: "/image-tools/blur-image" },
    { title: "Image to Text (OCR)", href: "/image-tools/ocr" },
  ],
  "PDF Tools": [
    { title: "Merge PDF", href: "/pdf-tools/merge-pdf" },
    { title: "Split PDF", href: "/pdf-tools/split-pdf" },
    { title: "Compress PDF", href: "/pdf-tools/compress-pdf" },
    { title: "PDF to Image", href: "/pdf-tools/pdf-to-image" },
    { title: "Image to PDF", href: "/pdf-tools/image-to-pdf" },
    { title: "Rotate PDF", href: "/pdf-tools/rotate-pdf" },
  ],
  "Text Tools": [
    { title: "Word Counter", href: "/text-tools/word-counter" },
    { title: "Case Converter", href: "/text-tools/case-converter" },
    { title: "Text Formatter", href: "/text-tools/text-formatter" },
    { title: "Remove Duplicates", href: "/text-tools/remove-duplicates" },
    { title: "Lorem Ipsum", href: "/text-tools/lorem-ipsum" },
  ],
  "Dev Tools": [
    { title: "JSON Formatter", href: "/dev-tools/json-formatter" },
    { title: "Base64 Encoder", href: "/dev-tools/base64" },
    { title: "UUID Generator", href: "/dev-tools/uuid-generator" },
    { title: "JWT Decoder", href: "/dev-tools/jwt-decoder" },
    { title: "Hash Generator", href: "/dev-tools/hash-generator" },
    { title: "Regex Tester", href: "/dev-tools/regex-tester" },
    { title: "URL Encoder", href: "/dev-tools/url-encoder" },
    { title: "Cron Parser", href: "/dev-tools/cron-parser" },
    { title: "Markdown Renderer", href: "/dev-tools/markdown-renderer" },
  ],
  "Utilities": [
    { title: "QR Code Generator", href: "/utility-tools/qr-code" },
    { title: "Barcode Generator", href: "/utility-tools/barcode" },
    { title: "Password Generator", href: "/utility-tools/password-generator" },
    { title: "Color Converter", href: "/utility-tools/color-converter" },
    { title: "Unit Converter", href: "/utility-tools/unit-converter" },
    { title: "Timestamp Converter", href: "/utility-tools/timestamp" },
    { title: "Countdown Timer", href: "/utility-tools/countdown" },
  ],
  "Video Tools": [
    { title: "Compress Video", href: "/video-tools/compress-video" },
    { title: "Video to Audio", href: "/video-tools/video-to-audio" },
    { title: "Video to GIF", href: "/video-tools/video-to-gif" },
  ],
};

const categoryIcons: Record<string, React.ElementType> = {
  "Image Tools": Image,
  "PDF Tools": FileText,
  "Text Tools": Type,
  "Dev Tools": Code2,
  "Utilities": Wrench,
  "Video Tools": Video,
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-transparent to-sky-50/50 dark:to-sky-950/20">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

      <div className="container mx-auto px-4 py-16 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
              <img
                src="/logo_small.png"
                alt="UtilByte Logo"
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="font-display text-2xl font-bold tracking-tight">
                Util<span className="bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-400 bg-clip-text text-transparent">Byte</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Free online tools for everyday work. No sign-up required. Your files never leave your device.
              <span className="text-foreground font-medium"> 100% private.</span>
            </p>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                100% Private
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                <Sparkles className="h-4 w-4" />
                No Sign-up
              </div>
            </div>

            {/* Open Source */}
            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Github className="h-4 w-4" />
                Open Source
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                UtilByte is open source and MIT licensed. Contributions, bug reports, and feature requests are welcome!
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://github.com/KryssNa/utilbyte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors"
                >
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  Star on GitHub
                </a>
                <a
                  href="https://github.com/KryssNa/utilbyte/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors"
                >
                  <GitFork className="h-3.5 w-3.5 text-sky-500" />
                  Contribute
                </a>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => {
            const Icon = categoryIcons[category] || Wrench;
            return (
              <div key={category}>
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-foreground">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {category}
                </h3>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UtilByte. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Terms
            </Link>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" /> for productivity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

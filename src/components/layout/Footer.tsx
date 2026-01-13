import { Code2, FileText, Heart, Image, Shield, Sparkles, Type, Wrench, Zap } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  "Image Tools": [
    { title: "Image Cropper", href: "/image-tools/crop-image" },
    { title: "Image Compressor", href: "/image-tools/compress-image" },
    { title: "Format Converter", href: "/image-tools/format-converter" },
    { title: "Background Remover", href: "/image-tools/remove-background" },
    { title: "Image to Text (OCR)", href: "/image-tools/ocr" },
  ],
  "PDF Tools": [
    { title: "Merge PDF", href: "/pdf-tools/merge-pdf" },
    { title: "Split PDF", href: "/pdf-tools/split-pdf" },
    { title: "Compress PDF", href: "/pdf-tools/compress-pdf" },
    { title: "PDF to Image", href: "/pdf-tools/pdf-to-image" },
    { title: "Image to PDF", href: "/pdf-tools/image-to-pdf" },
  ],
  "Text Tools": [
    { title: "Word Counter", href: "/text-tools/word-counter" },
    { title: "Case Converter", href: "/text-tools/case-converter" },
    { title: "Remove Duplicates", href: "/text-tools/remove-duplicates" },
    { title: "Lorem Ipsum", href: "/text-tools/lorem-ipsum" },
  ],
  "Dev Tools": [
    { title: "JSON Formatter", href: "/dev-tools/json-formatter" },
    { title: "Base64 Encoder", href: "/dev-tools/base64" },
    { title: "UUID Generator", href: "/dev-tools/uuid-generator" },
    { title: "JWT Decoder", href: "/dev-tools/jwt-decoder" },
    { title: "Hash Generator", href: "/dev-tools/hash-generator" },
  ],
};

const categoryIcons: Record<string, React.ElementType> = {
  "Image Tools": Image,
  "PDF Tools": FileText,
  "Text Tools": Type,
  "Dev Tools": Code2,
  "Utilities": Wrench,
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-transparent to-violet-50/50 dark:to-violet-950/20">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="container mx-auto px-4 py-16 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Util<span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">Byte</span>
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
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400">
                <Sparkles className="h-4 w-4" />
                No Sign-up
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

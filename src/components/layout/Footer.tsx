import { Github } from "lucide-react";
import Link from "next/link";
import ConsentSettingsLink from "@/components/shared/ConsentSettingsLink";

const linkClass = "inline-flex min-h-10 items-center text-sm text-muted-foreground transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/20">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="col-span-2 min-w-0 md:col-span-1">
            <Link href="/" aria-label="UtilByte home" className="inline-flex items-center gap-2.5">
              <img src="/logo_small.png" alt="" className="h-7 w-auto" />
              <span className="font-display text-xl font-bold tracking-tight">Util<span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-400">Byte</span></span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Free tools for everyday work. No account needed. Local file tools process on your device; network tools explain where data goes.</p>
            <a href="https://github.com/KryssNa/utilbyte" target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-2 gap-2`}><Github aria-hidden="true" className="h-4 w-4" />Open source · MIT</a>
          </div>

          <nav aria-label="Footer explore">
            <h2 className="mb-2 text-sm font-semibold tracking-tight">Explore</h2>
            <ul>
              <li><Link href="/#tools" className={linkClass}>All tools</Link></li>
              <li><Link href="/guides" className={linkClass}>Guides</Link></li>
              <li><Link href="/ai" className={linkClass}>AI & MCP</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer project">
            <h2 className="mb-2 text-sm font-semibold tracking-tight">Project</h2>
            <ul>
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact & feedback</Link></li>
              <li><a href="https://github.com/KryssNa/utilbyte/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className={linkClass}>Contribute</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} UtilByte</p>
          <nav aria-label="Footer policies" className="flex flex-wrap items-center gap-x-5">
            <Link href="/privacy" className={`${linkClass} text-xs`}>Privacy</Link>
            <Link href="/terms" className={`${linkClass} text-xs`}>Terms</Link>
            <ConsentSettingsLink className={`${linkClass} text-xs`} />
          </nav>
        </div>
      </div>
    </footer>
  );
}

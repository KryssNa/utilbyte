"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Github, Menu, PlugZap, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu, SearchModal } from "./navbar";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMobileMenuOpen(false);
        setSearchOpen(true);
      }
    };
    const openSearch = () => { setMobileMenuOpen(false); setSearchOpen(true); };
    document.addEventListener("keydown", handler);
    window.addEventListener("utilbyte:open-tool-search", openSearch);
    return () => {
      document.removeEventListener("keydown", handler);
      window.removeEventListener("utilbyte:open-tool-search", openSearch);
    };
  }, []);
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  return <>
    <header className="sticky top-0 z-50 w-full">
      <div className="h-[2px] bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />
      <nav aria-label="Main navigation" className="relative border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-[calc(var(--header-height)-2px)] items-center justify-between gap-2 px-4 lg:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="UtilByte home">
            <img src="/logo_small.png" alt="" className="h-8 w-auto" />
            <span className="font-display text-xl font-bold tracking-tight">Util<span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-400">Byte</span></span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/ai" aria-label="Use with AI and MCP" aria-current={pathname === "/ai" ? "page" : undefined} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 sm:px-3">
              <PlugZap aria-hidden="true" className="h-4 w-4 text-primary" /><span className="hidden sm:inline">AI & MCP</span><span className="sm:hidden">MCP</span>
            </Link>
            <a href="https://github.com/KryssNa/utilbyte" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub" className="hidden min-h-10 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 sm:inline-flex sm:px-3"><Github className="h-4 w-4 text-primary" /><span className="hidden md:inline">GitHub</span></a>
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label={mobileMenuOpen ? "Close tool menu" : "Open tool menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-tool-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>
      </nav>
      <div id="mobile-tool-menu"><MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} /></div>
    </header>
    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>;
}

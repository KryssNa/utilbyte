"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, Command, Grid3X3, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MobileMenu, SearchModal, toolCategories } from "./navbar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  const clearPendingClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const startClose = useCallback(() => {
    clearPendingClose();
    closeTimer.current = setTimeout(() => setMegaOpen(false), 250);
  }, [clearPendingClose]);

  const open = useCallback(() => {
    clearPendingClose();
    setMegaOpen(true);
  }, [clearPendingClose]);

  const closeMega = useCallback(() => {
    clearPendingClose();
    setMegaOpen(false);
  }, [clearPendingClose]);

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="h-[2px] bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />

        <nav className="relative border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <img
                src="/logo_small.png"
                alt="UtilByte Logo"
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl font-bold tracking-tight">
                Util
                <span className="bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Byte
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:gap-1">
              <button
                ref={triggerRef}
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={open}
                onMouseLeave={startClose}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  megaOpen && "text-foreground bg-muted/50"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>All Tools</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", megaOpen && "rotate-180")} />
              </button>

              {toolCategories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  <cat.icon className={cn("h-3.5 w-3.5", cat.color)} />
                  <span>{cat.title}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Search tools...</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />K
                </kbd>
              </button>

              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon-sm"
                className="sm:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mega menu - positioned directly under nav, inside header for seamless hover */}
        {megaOpen && (
          <div
            ref={panelRef}
            onMouseEnter={open}
            onMouseLeave={startClose}
            className="hidden lg:block absolute left-0 right-0 z-40 animate-fade-in"
          >
            <div className="bg-background border-b border-border shadow-2xl shadow-black/8 dark:shadow-black/25">
              <div className="container mx-auto px-4 lg:px-6 py-8">
                <div className="grid grid-cols-6 gap-8">
                  {toolCategories.map((cat) => (
                    <div key={cat.title}>
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
                        <div className={cn("p-2 rounded-xl", cat.bgColor)}>
                          <cat.icon className={cn("h-4 w-4", cat.color)} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-foreground">{cat.title}</span>
                          <span className="text-[10px] text-muted-foreground ml-1.5">{cat.tools.length}</span>
                        </div>
                      </div>
                      <ul className="space-y-0.5">
                        {cat.tools.map((tool) => (
                          <li key={tool.href}>
                            <Link
                              href={tool.href}
                              onClick={closeMega}
                              className="group/item flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-150 hover:bg-muted"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="block text-sm font-medium text-foreground/90 group-hover/item:text-foreground transition-colors">
                                  {tool.title}
                                </span>
                                <span className="block text-[11px] text-muted-foreground leading-tight mt-0.5">
                                  {tool.desc}
                                </span>
                              </div>
                              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {totalTools} free browser-based tools &middot; No sign-up required
                  </span>
                  <button
                    onClick={() => { setSearchOpen(true); closeMega(); }}
                    className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Quick search
                    <kbd className="inline-flex h-4 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] text-muted-foreground">
                      <Command className="h-2.5 w-2.5" />K
                    </kbd>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* Backdrop overlay */}
      {megaOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/15 dark:bg-black/35"
          onClick={closeMega}
          aria-hidden
        />
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

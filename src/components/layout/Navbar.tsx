"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { ChevronDown, Command, Grid3X3, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MobileMenu, SearchModal, toolCategories } from "./navbar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaVisible, setMegaVisible] = useState(false);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const openMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    requestAnimationFrame(() => setMegaVisible(true));
  }, []);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => {
      setMegaVisible(false);
      setTimeout(() => setMegaOpen(false), 200);
    }, 120);
  }, []);

  const handleMegaLeave = useCallback((e: React.MouseEvent) => {
    const related = e.relatedTarget;
    const isInTrigger = related instanceof Node && triggerRef.current?.contains(related);
    const isInMega = related instanceof Node && megaRef.current?.contains(related);
    if (!isInTrigger && !isInMega) closeMega();
  }, [closeMega]);

  useEffect(() => {
    return () => { if (megaTimeout.current) clearTimeout(megaTimeout.current); };
  }, []);

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
                onMouseEnter={openMega}
                onMouseLeave={handleMegaLeave}
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

          {megaOpen && (
            <div
              ref={megaRef}
              onMouseEnter={openMega}
              onMouseLeave={handleMegaLeave}
              className={cn(
                "absolute left-0 right-0 top-full z-50 border-b border-border",
                "transition-[opacity,transform] duration-300 ease-out origin-top",
                megaVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <div className="bg-background/95 backdrop-blur-xl">
                <div className="container mx-auto px-4 lg:px-6 py-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {toolCategories.map((cat) => (
                      <div key={cat.title}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn("p-1.5 rounded-lg", cat.bgColor)}>
                            <cat.icon className={cn("h-3.5 w-3.5", cat.color)} />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {cat.title}
                          </span>
                        </div>
                        <ul className="space-y-0.5">
                          {cat.tools.map((tool) => (
                            <li key={tool.href}>
                              <Link
                                href={tool.href}
                                onClick={() => { setMegaVisible(false); setTimeout(() => setMegaOpen(false), 200); }}
                                className="block px-2 py-1.5 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
                              >
                                {tool.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{totalTools} free tools, no sign-up required</span>
                    <button
                      onClick={() => { setSearchOpen(true); setMegaVisible(false); setTimeout(() => setMegaOpen(false), 200); }}
                      className="text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="h-3 w-3" />
                      Search all tools
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

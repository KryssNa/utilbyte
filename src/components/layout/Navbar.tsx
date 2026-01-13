"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Command, Menu, Search, X, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MobileMenu,
  NavDropdown,
  SearchModal,
  toolCategories,
} from "./navbar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut for search
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Gradient line at top */}
        <div className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />

        <nav className="relative border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Util
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                  Byte
                </span>
              </span>
            </Link>

            {/* Desktop Navigation - Categories */}
            <div className="hidden lg:flex lg:items-center lg:gap-0">
              {toolCategories.map((category) => (
                <NavDropdown key={category.title} category={category} />
              ))}
            </div>

            {/* Right side - Search & Theme */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
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

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile search button */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="sm:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* Search Modal - Rendered via Portal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, CornerDownLeft, Search, SearchX, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PREFERENCES_KEY, sanitizePreferences } from "@/lib/tool-preferences";
import { recordToolEvent } from "@/lib/tool-events";
import { searchTools } from "@/lib/tool-search";
import { allTools, toolCategories, top10Tools } from "./data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [preferred, setPreferred] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) { setQuery(""); setCategory(""); return; }
    try {
      const prefs = sanitizePreferences(JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}"));
      setPreferred([...new Set([...prefs.pinned, ...prefs.recent])]);
    } catch { setPreferred([]); }
  }, [isOpen]);

  const searching = Boolean(query.trim());
  const pool = category ? allTools.filter(tool => tool.category === category) : allTools;
  const suggestions = [...new Set([...preferred, ...top10Tools.map(tool => tool.id)])]
    .flatMap(id => allTools.filter(tool => tool.id === id)).slice(0, 6);
  const results = searching ? searchTools(pool, query) : category ? pool : suggestions;
  const heading = searching ? "Search results" : category ? `${category === "Dev" ? "Developer" : category} tools` : preferred.length ? "Quick access" : "Featured tools";

  function reset() {
    setQuery("");
    setCategory("");
    inputRef.current?.focus();
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content
          className="fixed left-1/2 top-4 z-[101] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_80px_-16px_rgba(0,0,0,0.45)] outline-none sm:top-[12dvh] sm:max-h-[76dvh]"
          onOpenAutoFocus={event => {
            event.preventDefault();
            returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            inputRef.current?.focus();
          }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
            else document.querySelector<HTMLElement>('[data-tool-search-trigger]')?.focus();
          }}
          onKeyDown={event => {
            if (event.nativeEvent.isComposing || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
            if (event.target !== inputRef.current && !resultsRef.current?.contains(event.target as Node)) return;
            const links = Array.from(resultsRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
            if (!links.length) return;
            event.preventDefault();
            const current = links.indexOf(document.activeElement as HTMLAnchorElement);
            if (event.key === "ArrowUp" && current <= 0) inputRef.current?.focus();
            else links[Math.min(links.length - 1, Math.max(0, current + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Find a tool</Dialog.Title>
          <Dialog.Description className="sr-only">Search by tool name or task. Use arrow keys to browse results and Enter to open a tool.</Dialog.Description>

          <div className="flex shrink-0 items-center gap-3 px-4 sm:px-5">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef} aria-label="Search tools" type="search" value={query}
              autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={120} enterKeyHint="go"
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing && results.length) {
                  event.preventDefault();
                  resultsRef.current?.querySelector<HTMLAnchorElement>("a")?.click();
                }
              }}
              placeholder="Search tools or a task…"
              className="h-[72px] min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X aria-hidden="true" className="h-4 w-4" /></button>}
            <Dialog.Close aria-label="Close tool search" className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className="hidden rounded border px-1.5 py-0.5 text-[11px] sm:inline">Esc</span><X aria-hidden="true" className="h-5 w-5 sm:hidden" /></Dialog.Close>
          </div>

          <div role="group" aria-label="Filter by category" className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 pb-3 sm:px-4">
            {[{ title: "", label: "All tools" }, ...toolCategories.map(item => ({ title: item.title, label: item.title === "Dev" ? "Developer" : item.title }))].map(item => (
              <button key={item.title} type="button" aria-pressed={category === item.title} onClick={() => { setCategory(item.title); inputRef.current?.focus(); }} className={`min-h-11 shrink-0 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${category === item.title ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{item.label}</button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3">
            <div className="mb-2 flex items-center justify-between gap-3 px-3 text-xs text-muted-foreground">
              <span className="font-medium">{heading}</span>
              <span role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? "tool" : "tools"}</span>
            </div>
            <ul ref={resultsRef} aria-label={heading} className="space-y-1">
              {results.map((tool, index) => {
                const group = toolCategories.find(item => item.title === tool.category)!;
                const Icon = group.icon;
                return <li key={tool.id}>
                  <Link href={tool.href} onClick={() => { recordToolEvent(tool.id, "navigation_destination_selected", { surface: "search" }); onClose(); }}
                    className="group flex min-h-[68px] items-center gap-3 rounded-xl px-3 py-3 outline-none transition-colors hover:bg-muted focus:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-muted-foreground group-hover:text-foreground group-focus:text-foreground"><Icon aria-hidden="true" className="h-[18px] w-[18px]" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-foreground">{tool.title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{tool.desc}</span></span>
                    <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:block">{tool.category === "Dev" ? "Developer" : tool.category}</span>
                    {index === 0 ? <CornerDownLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground/50" /> : <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus:opacity-100" />}
                  </Link>
                </li>;
              })}
            </ul>
            {!results.length && <div className="flex flex-col items-center px-5 py-10 text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><SearchX aria-hidden="true" className="h-6 w-6 text-muted-foreground" /></span>
              <p className="text-sm font-medium">No matching tools</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Try a tool name like “JSON” or a task like “compress image”.</p>
              <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-lg border px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear filters and start again</button>
            </div>}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3 text-[11px] text-muted-foreground">
            <span className="hidden items-center gap-3 sm:flex"><span><kbd className="font-sans">↑ ↓</kbd> to navigate</span><span><kbd className="font-sans">↵</kbd> to open</span></span>
            <Link href="/#tools" onClick={onClose} className="inline-flex min-h-9 items-center gap-1.5 rounded-md font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Browse all {allTools.length} tools <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

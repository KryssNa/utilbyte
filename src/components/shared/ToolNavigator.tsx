"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { catalog, catalogCategories, type CatalogTool } from "@/lib/tool-catalog";
import { searchTools } from "@/lib/tool-search";
import type { ToolPreferences } from "@/lib/tool-preferences";

export default function ToolNavigator({ tool, initialCategory, prefs, onNavigate }: {
  tool?: CatalogTool;
  initialCategory?: string;
  prefs: ToolPreferences;
  onNavigate: (item: CatalogTool) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(tool?.category ?? initialCategory ?? "");
  useEffect(() => { setCategory(tool?.category ?? initialCategory ?? ""); setQuery(""); }, [tool?.id, tool?.category, initialCategory]);
  const resultList = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = searchTools(catalog, query);
  const searching = query.trim().length > 0;
  const categoryTools = catalog.filter(item => !category || item.category === category).sort((a, b) => Number(b.id === tool?.id) - Number(a.id === tool?.id) || (category ? 0 : b.featuredWeight - a.featuredWeight));

  function link(item: CatalogTool, description = false) {
    const active = item.id === tool?.id;
    return <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} onClick={() => onNavigate(item)}
      className={`group flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground"}`}>
      <span className="min-w-0 flex-1"><span className="block">{item.title}</span>{description && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{item.desc}</span>}</span>
      {active && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
    </Link>;
  }

  return <nav aria-label="Tool navigator" className="flex h-full min-h-0 flex-col" onKeyDown={event => {
      if (event.nativeEvent.isComposing || !searching) return;
      if (event.target !== input.current && !resultList.current?.contains(event.target as Node)) return;
      const links = Array.from(resultList.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
      if (event.key === "Enter" && event.target === input.current && links.length) { event.preventDefault(); links[0].click(); }
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && links.length) {
        event.preventDefault();
        const current = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (event.key === "ArrowUp" && current <= 0) input.current?.focus();
        else links[Math.min(links.length - 1, Math.max(0, current + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
      }
    }}>
    <div className="shrink-0 p-3 pb-2">
      <div className="mb-3 flex items-center justify-between px-1"><span className="text-sm font-semibold tracking-tight">Your toolkit</span><span className="text-xs text-muted-foreground">{catalog.length} tools</span></div>
      <div className="flex items-center gap-2 rounded-xl bg-muted/70 pl-3 pr-1 focus-within:bg-muted">
        <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input ref={input} data-tool-search-trigger aria-label="Search in sidebar" placeholder="Find a tool…" type="search" maxLength={120} value={query}
          onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && query) { event.preventDefault(); event.stopPropagation(); setQuery(""); } }}
          className="tool-search-input h-11 w-full min-w-0 bg-transparent text-base lg:text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden" />
        {query && <button type="button" aria-label="Clear sidebar search" onClick={() => { setQuery(""); input.current?.focus(); }} className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
      </div>
    </div>
    {!searching && <div role="group" aria-label="Sidebar categories" className="grid shrink-0 grid-cols-2 gap-1 border-b border-border/60 px-3 pb-3">
      <button type="button" aria-pressed={!category} onClick={() => setCategory("")} className={`col-span-2 flex min-h-10 items-center justify-between rounded-lg px-2.5 text-xs transition-colors ${!category ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>All tools<span className="text-[10px] opacity-70">{catalog.length}</span></button>
      {catalogCategories.map(item => <button key={item.href} type="button" aria-pressed={category === item.title} onClick={() => setCategory(item.title)}
        className={`flex min-h-11 items-center justify-between gap-1 rounded-lg px-2.5 text-xs transition-colors ${category === item.title ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
        {item.title === "Dev" ? "Developer" : item.title}<span className="text-[10px] opacity-70">{catalog.filter(tool => tool.category === item.title).length}</span>
      </button>)}
    </div>}
    <div ref={resultList} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
      {searching ? <>
        <p role="status" className="px-3 py-3 text-xs text-muted-foreground">{results.length} {results.length === 1 ? "tool" : "tools"} found</p>
        {results.map(item => link(item, true))}
        {!results.length && <div className="px-3 py-4"><p className="text-sm font-medium">No matching tools</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Try a task like “shrink image” or “format JSON”.</p><button type="button" className="mt-2 min-h-11 text-sm font-medium text-primary" onClick={() => { setQuery(""); input.current?.focus(); }}>Show all tools</button></div>}
      </> : <>
        {([ ["Pinned", prefs.pinned], ["Recent", prefs.recent.filter(id => id !== tool?.id && !prefs.pinned.includes(id)).slice(0, 3)] ] as const).map(([label, ids]) => ids.length > 0 && <div key={label} className="mb-3"><p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>{ids.map(id => catalog.find(item => item.id === id)).filter((item): item is CatalogTool => !!item).map(item => link(item))}</div>)}
        <h2 className="mb-2 flex items-center gap-2 px-3 pt-4 text-[13px] font-semibold tracking-tight text-foreground">
          <span aria-hidden="true" className="h-3.5 w-0.5 rounded-full bg-primary/70" />
          {category ? `${category === "Dev" ? "Developer" : category} tools` : "All tools"}
        </h2>
        {categoryTools.map(item => link(item))}
      </>}
    </div>
    <div className="shrink-0 border-t px-3 py-2"><Link href="/#tools" className="flex min-h-11 items-center justify-between rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">Explore all tools<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link></div>
  </nav>;
}

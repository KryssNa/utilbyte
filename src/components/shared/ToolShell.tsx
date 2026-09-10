"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { PanelLeft, Search, Star, X } from "lucide-react";
import { catalog, catalogCategories, type CatalogTool } from "@/lib/tool-catalog";
import { defaultPreferences, PREFERENCES_KEY, sanitizePreferences, type ToolPreferences } from "@/lib/tool-preferences";
import { useDraftGuard } from "./NavigationSafety";
import { recordToolEvent } from "@/lib/tool-events";

export default function ToolShell({ tool, isWorking, hasDraft, children }: { tool?: CatalogTool; isWorking: boolean; hasDraft?: boolean; children: ReactNode }) {
  const [prefs, setPrefs] = useState(defaultPreferences);
  const [drawer, setDrawer] = useState(false);
  const [dirty, setDirty] = useState(false);
  const unsaved = (hasDraft ?? dirty) || isWorking;
  useDraftGuard(unsaved);
  useEffect(() => {
    try {
      const saved = sanitizePreferences(JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}"));
      if (tool) saved.recent = [tool.id, ...saved.recent.filter(id => id !== tool.id)].slice(0, 5);
      setPrefs(saved);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(saved));
      document.documentElement.dataset.toolFocus = String(saved.focus);
      document.documentElement.dataset.toolCompact = String(saved.compact);
    } catch { /* Storage is optional; processing never depends on it. */ }
    if (tool) recordToolEvent(tool.id, "tool_ready");
  }, [tool]);
  function update(next: ToolPreferences) {
    setPrefs(next);
    document.documentElement.dataset.toolFocus = String(next.focus);
    document.documentElement.dataset.toolCompact = String(next.compact);
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); } catch { /* private mode */ }
  }
  function link(item: CatalogTool) {
    return <Link key={item.id} href={item.href} aria-current={item.id === tool?.id ? "page" : undefined} onClick={() => { recordToolEvent(item.id, "navigation_destination_selected", { surface: drawer ? "drawer" : "sidebar" }); setDrawer(false); }} className={`block min-h-11 rounded-lg px-3 py-3 text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary ${item.id === tool?.id ? "bg-primary/10 font-semibold text-primary" : ""}`}>{item.title}</Link>;
  }
  function navigator() {
    return <nav aria-label="Tool navigator" className="space-y-3 p-3">
      <button type="button" onClick={() => { setDrawer(false); requestAnimationFrame(() => window.dispatchEvent(new Event("utilbyte:open-tool-search"))); }} className="flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 text-sm"><Search className="h-4 w-4" />Search tools</button>
      {[["Pinned", prefs.pinned], ["Recent", prefs.recent.filter(id => id !== tool?.id)]] .map(([label, ids]) => <div key={String(label)}><p className="px-3 py-2 text-xs font-semibold text-muted-foreground">{label}</p>{(ids as string[]).length ? (ids as string[]).map(id => catalog.find(item => item.id === id)).filter((item): item is CatalogTool => !!item).map(link) : <p className="px-3 text-xs text-muted-foreground">{label === "Pinned" ? "Pin a tool to keep it here." : "Tools you visit appear here."}</p>}</div>)}
      {catalogCategories.map(category => <details key={category.href} open={category.title === tool?.category}>
        <summary className="min-h-11 cursor-pointer rounded-lg px-3 py-3 text-sm font-semibold">{category.title === "Dev" ? "Developer" : category.title} tools</summary>
        {[...new Set(catalog.filter(item => item.category === category.title).map(item => item.subgroup))].map(group => <div key={group}>{category.title === "Dev" && <p className="px-3 pt-3 text-xs text-muted-foreground">{group}</p>}{catalog.filter(item => item.category === category.title && item.subgroup === group).map(link)}</div>)}
      </details>)}
      <Link className="block min-h-11 px-3 py-3 text-sm" href="/#tools">All tools</Link><Link className="block min-h-11 px-3 py-3 text-sm" href="/guides">Guides</Link>
      <label className="flex min-h-11 items-center gap-2 px-3 text-sm"><input type="checkbox" checked={prefs.compact} onChange={event => update({ ...prefs, compact: event.target.checked })} />Collapse desktop navigator</label>
      <button className="min-h-11 px-3 text-xs underline" onClick={() => update({ ...prefs, pinned: [], recent: [] })}>Clear pins and recent tools</button>
      <p className="px-3 text-xs text-muted-foreground">Only tool IDs and layout choices are saved. Tool inputs are not saved.</p>
    </nav>;
  }
  if (!tool) return <>{children}</>;
  return <div className="tool-shell">
    <aside className="tool-rail border-r bg-card/40"><div className="sticky top-[var(--header-height)] max-h-[calc(100dvh-var(--header-height))] overflow-y-auto">{navigator()}</div></aside>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
        <Dialog.Root open={drawer} onOpenChange={open => { setDrawer(open); if (open) recordToolEvent(tool.id, "navigation_opened", { surface: "drawer" }); }}>
          <Dialog.Trigger className="inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm"><PanelLeft className="h-4 w-4" />Tools</Dialog.Trigger>
          <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60" /><Dialog.Content className="fixed inset-y-0 left-0 z-[101] flex w-[min(22rem,90vw)] flex-col border-r bg-background">
            <div className="flex items-center justify-between border-b p-3"><Dialog.Title className="font-semibold">Browse tools</Dialog.Title><Dialog.Close aria-label="Close tools" className="flex h-11 w-11 items-center justify-center"><X className="h-5 w-5" /></Dialog.Close></div>
            <Dialog.Description className="sr-only">Pinned, recent, and categorized tools.</Dialog.Description><div className="min-h-0 overflow-y-auto">{navigator()}</div>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root>
        <button type="button" className="min-h-11 rounded-lg border px-3 text-sm" aria-pressed={prefs.focus} onClick={() => { update({ ...prefs, focus: !prefs.focus }); recordToolEvent(tool.id, "focus_mode_changed"); }}>{prefs.focus ? "Exit focus mode" : "Focus mode"}</button>
        <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm" aria-pressed={prefs.pinned.includes(tool.id)} onClick={() => update({ ...prefs, pinned: prefs.pinned.includes(tool.id) ? prefs.pinned.filter(id => id !== tool.id) : [tool.id, ...prefs.pinned].slice(0, 6) })}><Star className="h-4 w-4" />{prefs.pinned.includes(tool.id) ? "Unpin tool" : "Pin tool"}</button>
        {unsaved && <span className="text-xs text-muted-foreground">Unsaved work · leaving will ask first</span>}
      </div>
      <div onInputCapture={() => setDirty(true)} onChangeCapture={() => setDirty(true)} onDropCapture={event => { if (event.dataTransfer.files.length) setDirty(true); }} onClickCapture={event => { if ((event.target as Element).closest("[data-tool-workspace] button")) setDirty(true); }}>{children}</div>
    </div>
  </div>;
}

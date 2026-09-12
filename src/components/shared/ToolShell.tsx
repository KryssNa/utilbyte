"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PanelLeft, Star, X } from "lucide-react";
import { type CatalogTool } from "@/lib/tool-catalog";
import { defaultPreferences, PREFERENCES_KEY, sanitizePreferences, type ToolPreferences } from "@/lib/tool-preferences";
import { useDraftGuard } from "./NavigationSafety";
import ToolNavigator from "./ToolNavigator";
import ToolFeedback from "./ToolFeedback";
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
      window.dispatchEvent(new Event("utilbyte:preferences-changed"));
      document.documentElement.dataset.toolFocus = String(saved.focus);
      document.documentElement.dataset.toolCompact = String(saved.compact);
    } catch { /* Storage is optional; processing never depends on it. */ }
    if (tool) recordToolEvent(tool.id, "tool_ready");
  }, [tool]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeDesktopDrawer = () => { if (desktop.matches) setDrawer(false); };
    closeDesktopDrawer();
    desktop.addEventListener("change", closeDesktopDrawer);
    return () => desktop.removeEventListener("change", closeDesktopDrawer);
  }, []);
  function update(next: ToolPreferences) {
    setPrefs(next);
    document.documentElement.dataset.toolFocus = String(next.focus);
    document.documentElement.dataset.toolCompact = String(next.compact);
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); window.dispatchEvent(new Event("utilbyte:preferences-changed")); } catch { /* private mode */ }
  }
  function navigator() {
    if (!tool) return null;
    return <ToolNavigator tool={tool} prefs={prefs} onNavigate={item => {
      recordToolEvent(item.id, "navigation_destination_selected", { surface: drawer ? "drawer" : "sidebar" });
      setDrawer(false);
    }} />;
  }
  if (!tool) return <>{children}</>;
  return <div className="min-w-0">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-card/30 px-4 py-1 lg:px-6">
        <Dialog.Root open={drawer} onOpenChange={open => { setDrawer(open); if (open) recordToolEvent(tool.id, "navigation_opened", { surface: "drawer" }); }}>
          <Dialog.Trigger className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm lg:hidden"><PanelLeft className="h-4 w-4" />Tools</Dialog.Trigger>
          <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60" /><Dialog.Content className="fixed inset-y-0 left-0 z-[101] flex w-[min(22rem,90vw)] flex-col border-r bg-background">
            <div className="flex items-center justify-between border-b p-3"><Dialog.Title className="font-semibold">Browse tools</Dialog.Title><Dialog.Close aria-label="Close tools" className="flex h-11 w-11 items-center justify-center"><X className="h-5 w-5" /></Dialog.Close></div>
            <Dialog.Description className="sr-only">Pinned, recent, and categorized tools.</Dialog.Description><div className="min-h-0 flex-1">{navigator()}</div>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root>
        <button type="button" className="min-h-11 rounded-lg px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground" aria-pressed={prefs.focus} onClick={() => { update({ ...prefs, focus: !prefs.focus }); recordToolEvent(tool.id, "focus_mode_changed"); }}>{prefs.focus ? "Show guides" : "Hide guides"}</button>
        <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground" aria-pressed={prefs.pinned.includes(tool.id)} onClick={() => update({ ...prefs, pinned: prefs.pinned.includes(tool.id) ? prefs.pinned.filter(id => id !== tool.id) : [tool.id, ...prefs.pinned].slice(0, 6) })}><Star className={`h-3.5 w-3.5 ${prefs.pinned.includes(tool.id) ? "fill-primary text-primary" : ""}`} />{prefs.pinned.includes(tool.id) ? "Unpin tool" : "Pin tool"}</button>
        {unsaved && <span className="text-xs text-muted-foreground">Unsaved work · leaving will ask first</span>}
        <ToolFeedback key={tool.id} tool={tool} />
      </div>
      <div onInputCapture={() => setDirty(true)} onChangeCapture={() => setDirty(true)} onDropCapture={event => { if (event.dataTransfer.files.length) setDirty(true); }} onClickCapture={event => { if ((event.target as Element).closest("[data-tool-workspace] button:not([data-file-picker])")) setDirty(true); }}>{children}</div>
    </div>
  </div>;
}

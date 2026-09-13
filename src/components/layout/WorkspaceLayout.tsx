"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ToolNavigator from "@/components/shared/ToolNavigator";
import { catalogCategories, getTool } from "@/lib/tool-catalog";
import { defaultPreferences, PREFERENCES_KEY, sanitizePreferences } from "@/lib/tool-preferences";
import { recordToolEvent } from "@/lib/tool-events";

/** One persistent desktop navigation surface for the entire site. */
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const tool = getTool(pathname);
  const category = catalogCategories.find(item => item.href === pathname)?.title;
  const [prefs, setPrefs] = useState(defaultPreferences);

  useEffect(() => {
    const read = () => {
      try { setPrefs(sanitizePreferences(JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}"))); }
      catch { /* Navigation remains available when storage is disabled. */ }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("utilbyte:preferences-changed", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("utilbyte:preferences-changed", read);
    };
  }, [pathname]);

  return <div className="tool-shell min-w-0 flex-1">
    <aside className="tool-rail border-r border-border/70 bg-card/60">
      <div className="sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))]">
        <ToolNavigator tool={tool} initialCategory={category} prefs={prefs} onNavigate={item => recordToolEvent(item.id, "navigation_destination_selected", { surface: "sidebar" })} />
      </div>
    </aside>
    <div className="flex min-w-0 flex-col">{children}</div>
  </div>;
}

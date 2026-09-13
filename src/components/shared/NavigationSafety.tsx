"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";

const GuardContext = createContext<(dirty: boolean) => void>(() => {});
const MESSAGE = "Leave this tool? Your current input and results are not saved. Choose Cancel to keep working.";

export function NavigationSafety({ children }: { children: ReactNode }) {
  const dirty = useRef(false);
  const setDirty = useCallback((value: boolean) => { dirty.current = value; }, []);
  useEffect(() => {
    const push = window.history.pushState;
    const replace = window.history.replaceState;
    let index = Number.isInteger(history.state?.utilbyteIndex) ? history.state.utilbyteIndex : 0;
    let restoring = false;
    replace.call(history, { ...history.state, utilbyteIndex: index }, "");
    // Tag entries without adding synthetic history entries or changing Next's state.
    history.pushState = function(state, unused, url) {
      index++;
      push.call(this, { ...state, utilbyteIndex: index }, unused, url);
    };
    history.replaceState = function(state, unused, url) {
      replace.call(this, { ...state, utilbyteIndex: index }, unused, url);
    };
    function click(event: MouseEvent) {
      if (!dirty.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest?.("a");
      if (!anchor || anchor.download || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.pathname === location.pathname && url.search === location.search && url.origin === location.origin) return;
      if (!window.confirm(MESSAGE)) { event.preventDefault(); event.stopImmediatePropagation(); }
      else dirty.current = false;
    }
    function pop(event: PopStateEvent) {
      const target = event.state?.utilbyteIndex;
      if (restoring) { restoring = false; event.stopImmediatePropagation(); return; }
      if (!Number.isInteger(target)) return;
      if (dirty.current && target !== index && !window.confirm(MESSAGE)) {
        event.stopImmediatePropagation();
        restoring = true;
        history.go(index - target);
      } else { index = target; dirty.current = false; }
    }
    function unload(event: BeforeUnloadEvent) {
      if (dirty.current) { event.preventDefault(); event.returnValue = ""; }
    }
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", pop, true);
    window.addEventListener("beforeunload", unload);
    return () => {
      history.pushState = push; history.replaceState = replace;
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop, true);
      window.removeEventListener("beforeunload", unload);
    };
  }, []);
  return <GuardContext.Provider value={setDirty}>{children}</GuardContext.Provider>;
}
export function useDraftGuard(dirty: boolean) {
  const setDirty = useContext(GuardContext);
  useEffect(() => { setDirty(dirty); return () => setDirty(false); }, [dirty, setDirty]);
}

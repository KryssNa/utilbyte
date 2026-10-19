"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const AdContext = createContext(false);
export const useAdsAllowed = () => useContext(AdContext);

/** Only manual units are supported. Disable Auto ads in the AdSense dashboard. */
export default function AdSenseScript({ nonce, toolPaths, guidePaths, children }: {
  nonce: string; toolPaths: string[]; guidePaths: string[]; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4931770581801597";
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  useEffect(() => {
    const sync = () => {
      const focus = document.documentElement.dataset.toolFocus === "true";
      const content = document.querySelector("main [data-ad-content]");
      const eligible = enabled && Boolean(content) &&
        (guidePaths.includes(pathname) || (toolPaths.includes(pathname) && !focus));
      const queue = (window.adsbygoogle = window.adsbygoogle || []);
      queue.pauseAdRequests = eligible ? 0 : 1;
      setAllowed(eligible);
      document.documentElement.dataset.adsAllowed = String(eligible);
    };
    sync();
    const contentObserver = new MutationObserver(sync);
    const main = document.querySelector("main");
    if (main) contentObserver.observe(main, { childList: true, subtree: true });
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tool-focus"] });
    window.addEventListener("utilbyte:preferences-changed", sync);
    return () => { contentObserver.disconnect(); observer.disconnect(); window.removeEventListener("utilbyte:preferences-changed", sync); };
  }, [pathname, enabled, guidePaths, toolPaths]);

  useEffect(() => {
    if (!allowed || loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.id = "utilbyte-adsense";
    script.async = true;
    script.nonce = nonce;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.onload = () => setReady(true);
    script.onerror = () => { loaded.current = false; setReady(false); };
    document.head.appendChild(script);
    // The loaded runtime persists for this document. Eligibility pauses it and
    // unmounts manual units; removing the script would not unload that runtime.
  }, [allowed, client, nonce]);

  useEffect(() => {
    // Cross the ad/content boundary with a new document so Google's runtime
    // cannot carry over into policy, navigation, or error pages.
    const onClick = (event: MouseEvent) => {
      if (!loaded.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || toolPaths.includes(url.pathname) || guidePaths.includes(url.pathname)) return;
      if (url.pathname === location.pathname) return;
      event.preventDefault();
      location.assign(url.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [guidePaths, toolPaths]);

  useEffect(() => {
    if (loaded.current && !toolPaths.includes(pathname) && !guidePaths.includes(pathname)) location.reload();
  }, [pathname, guidePaths, toolPaths]);

  const routeAllowed = guidePaths.includes(pathname) || toolPaths.includes(pathname);
  return <AdContext.Provider value={enabled && routeAllowed && allowed && ready}>{children}</AdContext.Provider>;
}

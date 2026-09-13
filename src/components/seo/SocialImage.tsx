import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogTool } from "@/lib/tool-catalog";

const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/logo_small.png")).toString("base64")}`;
const categories: Record<string, { label: string; color: string; symbol: string }> = {
  Image: { label: "Image tools", color: "#66ceff", symbol: "image" },
  PDF: { label: "PDF tools", color: "#ff91ad", symbol: "pdf" },
  Text: { label: "Text tools", color: "#75e4bf", symbol: "text" },
  Dev: { label: "Developer tools", color: "#ffd080", symbol: "code" },
  Video: { label: "Video tools", color: "#ba9aff", symbol: "video" },
  Utility: { label: "Everyday utilities", color: "#78e3e8", symbol: "utility" },
};

function CategoryIcon({ symbol, color }: { symbol: string; color: string }) {
  return <svg width={100} height={100} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {symbol === "image" ? <g><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></g> :
      symbol === "pdf" ? <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></g> :
      symbol === "text" ? <g><path d="M4 6V3h16v3M12 3v18M8 21h8" /></g> :
      symbol === "code" ? <g><path d="m7 6-5 6 5 6m10-12 5 6-5 6m-3-15-4 18" /></g> :
      symbol === "video" ? <g><rect x="2" y="5" width="14" height="14" rx="3" /><path d="m16 10 6-4v12l-6-4" /></g> :
      <g><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" /></g>}
  </svg>;
}

/** Shared layout keeps every crawler preview legible at thumbnail size. */
export default function SocialImage({ tool, toolCount }: { tool?: CatalogTool; toolCount: number }) {
  const category = tool ? categories[tool.category] : undefined;
  const accent = category?.color ?? "#a99bff";
  return <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "54px 64px 38px", background: "#080b14", color: "#f6f7ff", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
    <div style={{ display: "flex", position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 95% 5%, #232147 0%, transparent 60%)" }} />
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, height: 5, width: "100%", backgroundImage: `linear-gradient(90deg, ${accent}, #3d65ef, #60ded9)` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: accent, fontSize: 20, letterSpacing: 2, fontWeight: 700 }}>
      <div style={{ width: 8, height: 8, borderRadius: 8, background: accent }} />
      {category ? category.label.toUpperCase() : "ONE TOOLKIT. EVERYDAY POSSIBILITIES."}
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 48 }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", whiteSpace: "pre-wrap", fontSize: tool && tool.title.length > 26 ? 58 : 70, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 780 }}>{tool ? tool.title : "Free tools.\nLess busywork."}</div>
        <div style={{ display: "flex", marginTop: 25, color: "#b3bdd3", fontSize: 28, lineHeight: 1.35, maxWidth: 720 }}>{tool ? tool.desc : "Images, PDFs, text, code, video and more."}</div>
        <div style={{ display: "flex", marginTop: 30, alignItems: "center", gap: 10, color: "#d9e0f2", fontSize: 19 }}><svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2}><path d="m5 12 4 4L19 6" /></svg> Free to use <span style={{ color: "#555f79", margin: "0 6px" }}>·</span> No account required</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 184, height: 184, borderRadius: 36, background: "#121727", border: "1px solid #343b57", boxShadow: "0 16px 60px #03050c", marginRight: 10 }}>
        {category ? <CategoryIcon symbol={category.symbol} color={accent} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: accent, lineHeight: 1 }}>{toolCount}</div><div style={{ display: "flex", fontSize: 18, marginTop: 12, color: "#b3bdd3" }}>useful tools</div></div>}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #283049", paddingTop: 25 }}>
      <div style={{ display: "flex", color: "#99a6c0", fontSize: 19 }}>{tool ? `utilbyte.app${tool.href}` : "utilbyte.app"}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src={logo} width={44} height={44} alt="" /><div style={{ display: "flex", fontWeight: 700, fontSize: 27 }}>Util<span style={{ color: "#67e0e5" }}>Byte</span></div></div>
    </div>
  </div>;
}

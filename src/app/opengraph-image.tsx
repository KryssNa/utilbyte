import { ImageResponse } from "next/og";
import { catalog } from "@/lib/tool-catalog";

export const alt = "UtilByte — Free tools for everyday work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#090b16", color: "#f6f7ff", padding: "80px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", color: "#9991ff", fontSize: 34, marginBottom: 40 }}>UtilByte</div>
      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>Free tools.<br />Less busywork.</div>
      <div style={{ display: "flex", color: "#b6bdcf", fontSize: 27, marginTop: 36 }}>{catalog.length} tools for images, PDFs, text, code and more.</div>
      <div style={{ display: "flex", color: "#76e5d0", fontSize: 24, marginTop: 24 }}>No account required. Open a tool and get started.</div>
    </div>, size,
  );
}

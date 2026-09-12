import { ImageResponse } from "next/og";
import { catalog } from "@/lib/tool-catalog";
import SocialImage from "@/components/seo/SocialImage";

export const alt = "UtilByte — Free tools for everyday work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<SocialImage toolCount={catalog.length} />, size);
}

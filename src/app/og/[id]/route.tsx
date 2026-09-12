import { ImageResponse } from "next/og";
import SocialImage from "@/components/seo/SocialImage";
import { catalog } from "@/lib/tool-catalog";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map(tool => ({ id: tool.id }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = catalog.find(item => item.id === id);
  if (!tool) return new Response("Image not found", { status: 404 });
  return new ImageResponse(<SocialImage tool={tool} toolCount={catalog.length} />, {
    width: 1200, height: 630,
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}

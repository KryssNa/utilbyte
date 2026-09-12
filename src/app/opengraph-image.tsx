import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SOCIAL_CARD } from "@/lib/social-card";

export const alt = SOCIAL_CARD.alt;
export const size = { width: SOCIAL_CARD.width, height: SOCIAL_CARD.height };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new Response(new Uint8Array(readFileSync(join(process.cwd(), "public/social-card.png"))), {
    headers: { "Content-Type": contentType },
  });
}

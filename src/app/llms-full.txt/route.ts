import { discoveryTextResponse, renderLlmsFull } from "@/lib/ai-discovery";

export const dynamic = "force-static";

export function GET(): Response {
  return discoveryTextResponse(renderLlmsFull());
}

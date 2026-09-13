import { discoveryTextResponse, renderLlmsIndex } from "@/lib/ai-discovery";

export const dynamic = "force-static";

export function GET(): Response {
  return discoveryTextResponse(renderLlmsIndex());
}

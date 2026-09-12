import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import SocialImage from "../src/components/seo/SocialImage";
import { catalog } from "../src/lib/tool-catalog";

async function main() {
  const response = new ImageResponse(createElement(SocialImage, { toolCount: catalog.length }), {
    width: 1200, height: 630,
  });
  writeFileSync("public/social-card.png", Buffer.from(await response.arrayBuffer()));
  console.log("Generated public/social-card.png (1200 × 630).");
}

main().catch(error => { console.error(error); process.exitCode = 1; });

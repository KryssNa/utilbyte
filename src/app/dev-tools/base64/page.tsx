import { createToolMetadata } from "@/lib/tool-metadata";
import Base64Tool from "@/components/tools/dev/Base64Tool";

export const metadata = createToolMetadata("/dev-tools/base64", {
  title: "Base64 Encoder Decoder Online Free - Encode Decode Base64 Text",
  description: "Encode UTF-8 text as Base64 or decode Base64 back to text in your browser. Includes URL-safe decoding and clear errors for invalid input.",
  keywords: [
    "base64 encoder decoder online free",
    "encode base64 online",
    "decode base64 online",
    "base64 converter",
    "text to base64",
    "base64 to text",
    "base64 encoder",
    "base64 decoder",
    "online base64 tool",
    "base64 encode decode",
    "base64 string converter"
  ],
});

export default function Base64ToolPage() {
  return (
    <Base64Tool />

  );
}

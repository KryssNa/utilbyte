import { createToolMetadata } from "@/lib/tool-metadata";
import JwtDecoder from "@/components/tools/dev/JwtDecoder";

export const metadata = createToolMetadata("/dev-tools/jwt-decoder", {
  title: "JWT Decoder Online Free - Decode JSON Web Tokens Instantly",
  description: "Decode JWT header and payload fields in your browser and inspect expiration claims. Decoding does not verify the token signature or prove authenticity.",
  keywords: [
    "jwt decoder online free",
    "json web token decoder",
    "decode jwt token",
    "jwt inspector online",
    "jwt validator",
    "jwt token analyzer",
    "jwt header decoder",
    "jwt payload decoder",
    "jwt signature verification",
    "authentication token decoder",
    "api jwt debugger",
    "oauth token inspector"
  ],
});

export default function JwtDecoderPage() {
  return (
    <JwtDecoder />

  );
}

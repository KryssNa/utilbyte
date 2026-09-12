import { createToolMetadata } from "@/lib/tool-metadata";
import LoremIpsum from "@/components/tools/text/LoremIpsum";

export const metadata = createToolMetadata("/text-tools/lorem-ipsum", {
  title: "Lorem Ipsum Generator Online Free - Generate Placeholder Text Instantly",
  description:
    "Generate Lorem Ipsum placeholder text online for free. Create custom paragraphs, sentences, words with HTML tags. Perfect for designers, developers, and content creators.",
  keywords: [
    "lorem ipsum generator online free",
    "generate lorem ipsum text",
    "placeholder text generator",
    "dummy text online",
    "lorem ipsum paragraphs",
    "placeholder content creator",
    "design mockup text",
    "web design placeholder",
    "typography placeholder",
    "sample text generator",
    "filler text generator",
    "lorem ipsum html"
  ],
});

export default function LoremIpsumPage() {
  return (
    <LoremIpsum />

  );
}

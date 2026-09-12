import { createToolMetadata } from "@/lib/tool-metadata";
import MarkdownRenderer from "@/components/tools/dev/MarkdownRenderer";

export const metadata = createToolMetadata("/dev-tools/markdown-renderer", {
  title: "Markdown Renderer Online Free - Live Preview & GitHub Flavored Markdown",
  description:
    "Render and preview Markdown online for free. Live preview, GitHub Flavored Markdown support, syntax highlighting, HTML export. Perfect for documentation and blogging.",
  keywords: [
    "markdown renderer online free",
    "markdown preview online",
    "github flavored markdown",
    "markdown to html converter",
    "live markdown editor",
    "markdown syntax highlighting",
    "markdown parser online",
    "github markdown preview",
    "markdown viewer online",
    "convert markdown to html",
    "markdown editor online",
    "documentation markdown"
  ],
});

export default function MarkdownRendererPage() {
  return (
    <MarkdownRenderer />

  );
}

import ToolStructuredData from "@/components/shared/ToolStructuredData";
import OnlineCompiler from "@/components/tools/dev/OnlineCompiler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Code Runner - JavaScript, TypeScript and Python",
  description:
    "Run JavaScript, TypeScript and Python in your browser. Preview HTML, CSS and Markdown, and format JSON in one free workspace.",
  keywords: [
    "online compiler",
    "code runner online",
    "run code online free",
    "javascript compiler",
    "python online",
    "html css editor",
    "typescript playground",
    "online code editor",
  ],
  openGraph: {
    title: "Online Code Runner - JavaScript, TypeScript and Python",
    description: "Run JavaScript, TypeScript and Python locally, preview HTML and CSS, and work with JSON and Markdown.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Compiler - Code Runner",
    description: "Run JavaScript, TypeScript and Python in your browser, with HTML, CSS, JSON and Markdown modes.",
  },
  alternates: {
    canonical: "/dev-tools/online-compiler",
  },
};

export default function OnlineCompilerPage() {
  return <><ToolStructuredData href="/dev-tools/online-compiler" /><OnlineCompiler /></>;
}

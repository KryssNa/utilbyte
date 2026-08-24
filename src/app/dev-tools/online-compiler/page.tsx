import OnlineCompiler from "@/components/tools/dev/OnlineCompiler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Compiler & Code Runner - Run Code in 10+ Languages Free",
  description:
    "Write and run code online for free. Supports JavaScript, TypeScript, Python, HTML, CSS, and more. Instant output with syntax highlighting.",
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
    title: "Online Compiler - Run Code in 10+ Languages Free",
    description: "Write and run code online for free. Supports JavaScript, TypeScript, Python, HTML, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Compiler - Code Runner",
    description: "Write and run code online for free in 10+ programming languages.",
  },
  alternates: {
    canonical: "/dev-tools/online-compiler",
  },
};

export default function OnlineCompilerPage() {
  return <OnlineCompiler />;
}

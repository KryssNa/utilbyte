import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Tools - Count, Format, Convert & Clean Text",
  description:
    "Free text tools for case conversion, word counting, text formatting, lorem ipsum generation, and duplicate removal.",
  alternates: { canonical: "/text-tools" },
};

export default function TextToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="Text"
      badgeLabel="Text Tools"
      heading="All Text Tools"
      description="Simple and fast tools to process text for writing, content editing, and productivity."
      accentClassName="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    />
  );
}

import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools - Merge, Split, Compress & Convert PDFs",
  description:
    "Free PDF tools to merge, split, compress, edit, rotate, and convert PDF files in your browser with privacy-first processing.",
  alternates: { canonical: "/pdf-tools" },
};

export default function PdfToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="PDF"
      badgeLabel="PDF Tools"
      heading="All PDF Tools"
      description="Edit and optimize PDFs directly in your browser with no account required."
      accentClassName="border-rose-500/30 bg-rose-500/10 text-rose-400"
    />
  );
}

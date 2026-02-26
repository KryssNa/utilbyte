import PDFEditor from "@/components/tools/pdf/PDFEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Editor Online Free - Edit Any PDF Document",
  description:
    "Edit PDF files online for free. Add text, images, drawings, highlights, and annotations. No upload required - everything runs in your browser.",
  keywords: [
    "pdf editor online free",
    "edit pdf online",
    "pdf text editor",
    "annotate pdf",
    "pdf markup tool",
    "add text to pdf",
    "draw on pdf",
    "highlight pdf",
  ],
  openGraph: {
    title: "PDF Editor Online Free - Edit Any PDF",
    description: "Edit PDF files online for free. Add text, images, drawings, highlights, and annotations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Editor Online Free",
    description: "Edit PDF files online for free. Add text, images, drawings, and annotations.",
  },
  alternates: {
    canonical: "/pdf-tools/edit-pdf",
  },
};

export default function EditPDFPage() {
  return <PDFEditor />;
}

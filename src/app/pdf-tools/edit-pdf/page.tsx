import { createToolMetadata } from "@/lib/tool-metadata";

import PDFEditor from "@/components/tools/pdf/PDFEditor";

export const metadata = createToolMetadata("/pdf-tools/edit-pdf", {
  title: "PDF Editor Online - Add Text, Drawings and Annotations",
  description: "Add text, images, drawings and annotations over PDF pages in your browser. Review the exported document; this is not a full editor for existing PDF text.",
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
});

export default function EditPDFPage() {
  return <PDFEditor />;
}

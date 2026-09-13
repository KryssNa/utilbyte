import { createToolMetadata } from "@/lib/tool-metadata";
import BarcodeGenerator from "@/components/tools/utility/BarcodeGenerator";

export const metadata = createToolMetadata("/utility-tools/barcode", {
  title: "Barcode Generator Online Free - Generate EAN13 CODE128 UPC Barcodes",
  description: "Generate barcode images from supported text and numeric inputs in your browser. Choose a format and verify the printed or displayed code with your scanner.",
  keywords: [
    "barcode generator online free",
    "ean13 barcode generator",
    "code128 barcode generator",
    "upc barcode generator",
    "code39 barcode generator",
    "barcode maker online",
    "generate product barcode",
    "inventory barcode creator",
    "retail barcode generator",
    "shipping barcode",
    "barcode label maker",
    "online barcode creator"
  ],
});

export default function BarcodeGeneratorPage() {
  return (
    <BarcodeGenerator />

  );
}

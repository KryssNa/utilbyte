import { createToolMetadata } from "@/lib/tool-metadata";
import QRCodeGenerator from "@/components/tools/utility/QRCodeGenerator";

export const metadata = createToolMetadata("/utility-tools/qr-code", {
  title: "QR Code Generator Online Free - Custom QR Codes with Logo & Colors",
  description: "Generate QR codes for text, URLs, Wi-Fi details and contacts in your browser. Customize available settings, download the image and test it with a scanner.",
  keywords: [
    "qr code generator online free",
    "custom qr code generator",
    "qr code with logo",
    "colored qr code maker",
    "advanced qr code creator",
    "wifi qr code generator",
    "vcard qr code",
    "qr code designer online",
    "qr code customization",
    "qr code maker free",
    "dynamic qr code",
    "qr code for business"
  ],
});

export default function QRCodeGeneratorPage() {
  return (
    <QRCodeGenerator />

  );
}

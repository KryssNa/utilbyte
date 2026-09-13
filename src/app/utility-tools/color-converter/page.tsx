import { createToolMetadata } from "@/lib/tool-metadata";
import ColorConverter from "@/components/tools/utility/ColorConverter";

export const metadata = createToolMetadata("/utility-tools/color-converter", {
  title: "Color Converter Online Free - HEX RGB HSL HSV CMYK Color Converter",
  description: "Convert color values between HEX, RGB, HSL, HSV and CMYK in your browser. Preview colors and copy their values; CMYK results are not print-profile conversions.",
  keywords: [
    "color converter online free",
    "hex to rgb converter",
    "rgb to hex converter",
    "hsl to rgb converter",
    "color picker online",
    "hex color code converter",
    "rgb color converter",
    "hsl color converter",
    "hsv color converter",
    "cmyk color converter",
    "color palette generator",
    "web color converter",
    "css color converter"
  ],
});

export default function ColorConverterPage() {
  return (
    <ColorConverter />

  );
}

import { createToolMetadata } from "@/lib/tool-metadata";
import UnitConverter from "@/components/tools/utility/UnitConverter";

export const metadata = createToolMetadata("/utility-tools/unit-converter", {
  title: "Unit Converter Online Free - Length Weight Temperature Area Volume Converter",
  description: "Convert common measurements including length, weight, temperature, area, volume and time in your browser. Choose units and inspect the calculated result.",
  keywords: [
    "unit converter online free",
    "length unit converter",
    "weight converter online",
    "temperature converter celsius fahrenheit",
    "area converter square meters",
    "volume converter liters gallons",
    "metric to imperial converter",
    "imperial to metric converter",
    "measurement conversion calculator",
    "physics unit converter",
    "engineering unit converter",
    "scientific calculator units"
  ],
});

export default function UnitConverterPage() {
  return (
    <UnitConverter />

  );
}

import ToolCategoryPage from "@/components/shared/ToolCategoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utility Tools - QR, Barcode, Password, Time & Conversion",
  description:
    "Free utility tools including QR code generator, barcode creator, password generator, timestamp converter, countdown timer, and more.",
  alternates: { canonical: "/utility-tools" },
};

export default function UtilityToolsCategoryPage() {
  return (
    <ToolCategoryPage
      categoryTitle="Utility"
      badgeLabel="Utility Tools"
      heading="All Utility Tools"
      description="Everyday utility tools for quick conversions, security, and sharing workflows."
      accentClassName="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
    />
  );
}

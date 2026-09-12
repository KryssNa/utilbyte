import { createToolMetadata } from "@/lib/tool-metadata";
import TimestampConverter from "@/components/tools/utility/TimestampConverter";

export const metadata = createToolMetadata("/utility-tools/timestamp", {
  title: "Timestamp Converter Online Free - Unix ISO 8601 UTC Date Converter",
  description:
    "Convert between timestamp formats online for free. Unix timestamp, ISO 8601, UTC, local time with date parsing and formatting. Perfect for developers and API work.",
  keywords: [
    "timestamp converter online free",
    "unix timestamp converter",
    "iso 8601 converter",
    "utc timestamp converter",
    "epoch timestamp converter",
    "date time converter",
    "timestamp to date",
    "date to timestamp",
    "api timestamp converter",
    "developer timestamp tool",
    "javascript timestamp",
    "python timestamp converter"
  ],
});

export default function TimestampConverterPage() {
  return (
    <TimestampConverter />

  );
}

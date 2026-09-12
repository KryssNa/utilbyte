import { createToolMetadata } from "@/lib/tool-metadata";
import CronParser from "@/components/tools/dev/CronParser";

export const metadata = createToolMetadata("/dev-tools/cron-parser", {
  title: "Cron Parser Online - Explain and Preview Schedules",
  description: "Inspect cron expressions and preview scheduled times in your browser. This tool does not install or run jobs; verify timing with your scheduler.",
  keywords: [
    "cron parser online free",
    "cron expression parser",
    "parse cron expression",
    "cron scheduler online",
    "cron job parser",
    "validate cron expression",
    "cron syntax checker",
    "next cron run time",
    "cron expression validator",
    "linux cron parser",
    "scheduled job parser",
    "cron expression tester"
  ],
});

export default function CronParserPage() {
  return (
    <CronParser />

  );
}

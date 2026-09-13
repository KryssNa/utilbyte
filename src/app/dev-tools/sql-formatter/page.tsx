import { createToolMetadata } from "@/lib/tool-metadata";
import SQLFormatter from "@/components/tools/dev/SQLFormatter";

export const metadata = createToolMetadata("/dev-tools/sql-formatter", {
  title: "SQL Formatter Online - Beautify SQL Queries Free",
  description:
    "Format and beautify SQL queries online for free. Make your SQL code readable with proper indentation and formatting. Supports MySQL, PostgreSQL, SQLite.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql online",
    "sql query formatter",
    "beautify sql",
    "sql code formatter",
    "sql pretty print",
    "mysql formatter",
    "postgresql formatter",
    "sqlite formatter"
  ],
});

export default function SQLFormatterPage() {
  return (
    <SQLFormatter />

  );
}

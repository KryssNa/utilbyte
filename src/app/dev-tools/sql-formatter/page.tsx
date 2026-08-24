import SQLFormatter from "@/components/tools/dev/SQLFormatter";
import { Metadata } from "next";

export const metadata: Metadata = {
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
  openGraph: {
    title: "SQL Formatter Online - Beautify SQL Queries Free",
    description:
      "Format and beautify SQL queries online for free. Supports MySQL, PostgreSQL, and SQLite.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter - Beautify SQL Queries Free",
    description:
      "Format SQL queries online with proper indentation. Supports MySQL, PostgreSQL, SQLite. Free and private.",
  },
  alternates: {
    canonical: "/dev-tools/sql-formatter",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SQL Formatter Online Free",
    description:
      "Format and beautify SQL queries online for free. Supports MySQL, PostgreSQL, SQLite.",
    url: "https://utilbyte.app/dev-tools/sql-formatter",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "SQL query formatting",
      "MySQL support",
      "PostgreSQL support",
      "SQLite support",
      "Proper indentation",
      "Free and private",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://utilbyte.app" },
      { "@type": "ListItem", position: 2, name: "Developer Tools", item: "https://utilbyte.app/dev-tools" },
      { "@type": "ListItem", position: 3, name: "SQL Formatter", item: "https://utilbyte.app/dev-tools/sql-formatter" },
    ],
  },
];

export default function SQLFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SQLFormatter />
    </>
  );
}

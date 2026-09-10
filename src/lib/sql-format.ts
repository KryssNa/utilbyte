import { formatDialect, sql, postgresql, mysql, sqlite } from "sql-formatter";

export const SQL_DIALECTS = { sql: "Standard SQL", postgresql: "PostgreSQL", mysql: "MySQL", sqlite: "SQLite" } as const;
const dialects = { sql, postgresql, mysql, sqlite };
export type SqlDialect = keyof typeof SQL_DIALECTS;
export type SqlKeywordCase = "preserve" | "upper" | "lower";
export const MAX_SQL_LENGTH = 100_000;

export function formatSql(input: string, language: SqlDialect, tabWidth = 2, keywordCase: SqlKeywordCase = "upper"): string {
  if (!input.trim()) return "";
  if (input.length > MAX_SQL_LENGTH) throw new Error("Use a query under 100,000 characters to keep formatting responsive.");
  return formatDialect(input, { dialect: dialects[language], tabWidth, keywordCase });
}

import assert from "node:assert/strict";
import test from "node:test";
import { formatSql, SQL_DIALECTS, MAX_SQL_LENGTH } from "../src/lib/sql-format";

for (const dialect of Object.keys(SQL_DIALECTS) as (keyof typeof SQL_DIALECTS)[]) {
  for (const indent of [2, 4]) for (const casing of ["upper", "lower", "preserve"] as const) {
    test(`${dialect}, ${indent}, ${casing}: literals and comment boundaries`, () => {
      const input = "select 'a  b', 'SELECT, FROM', 'it''s ok' from users -- keep WHERE literal\nwhere id = 1; /* SELECT x */ select 2;";
      const output = formatSql(input, dialect, indent, casing);
      for (const token of ["'a  b'", "'SELECT, FROM'", "'it''s ok'", "-- keep WHERE literal", "/* SELECT x */"]) assert.ok(output.includes(token), token);
      assert.match(output, /-- keep WHERE literal\r?\n\s*where/i);
      assert.match(output, /;\s*\/\* SELECT x \*\/\s*select\s+2;/i);
      assert.equal(formatSql(output, dialect, indent, casing), output);
    });
  }
}
test("Postgres identifiers, dollar quotes, parameters, CTEs and nested queries", () => {
  const input = 'WITH "select" AS (SELECT $$a  FROM b$$ AS "odd name") SELECT "odd name" FROM "select" WHERE $1 IN (SELECT id FROM t); SELECT $2::text;';
  const output = formatSql(input, "postgresql");
  for (const token of ['"select"', '$$a  FROM b$$', '"odd name"', '$1', '$2', '::text']) assert.ok(output.includes(token), token);
  assert.equal((output.match(/;/g) ?? []).length, 2);
});
test("MySQL escaped strings and quoted identifiers", () => {
  const output = formatSql("select `from`, 'it\\'s  fine' from `table` where id = ?", "mysql");
  for (const token of ["`from`", "'it\\'s  fine'", "`table`", "?"]) assert.ok(output.includes(token), token);
});
test("SQLite identifiers and named parameters", () => {
  const output = formatSql('select [order] from [group] where id = :id;', "sqlite");
  for (const token of ["[order]", "[group]", ":id"]) assert.ok(output.includes(token), token);
});
test("empty, unsupported and oversized input", () => {
  assert.equal(formatSql("  ", "sql"), "");
  assert.throws(() => formatSql("select 'unterminated", "sql"));
  assert.throws(() => formatSql("a".repeat(MAX_SQL_LENGTH + 1), "sql"), /100,000/);
});

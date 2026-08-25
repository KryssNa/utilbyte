import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const sqlFormatterArticle: ToolArticleContent = {
  intro: [
    "Queries arrive as a single line. An ORM logged it, a colleague pasted it out of a dashboard, it grew a clause at a time until nobody could read it.",
    "Formatting puts each clause on its own line and indents the structure. It changes nothing about what the query does, and it makes the mistakes visible.",
  ],
  sections: [
    {
      heading: "The errors that only show up once it is laid out",
      body: [
        "SQL mistakes are mostly structural, and structure is exactly what a single line hides.",
        "A missing join condition is the expensive one. Two tables in the FROM clause with nothing connecting them produces a cross product - every row of one against every row of the other. It runs, it returns data, and on small test tables it can even look plausible. Laid out with each join on its own line, a join with no ON clause is immediately obvious.",
        "Operator precedence in a WHERE clause is the subtle one. AND binds tighter than OR, so a condition written as A AND B OR C means (A AND B) OR C, not A AND (B OR C). On one line the intent is invisible; formatted and indented, the grouping is something you can actually check.",
        "Then there is a GROUP BY that does not cover every non-aggregated column - some databases reject it, others pick a value arbitrarily - and a LIMIT applied to a query where the ORDER BY makes the result non-deterministic.",
        "None of these are syntax errors. They all execute. They return the wrong rows, which is much worse than failing.",
      ],
      bullets: [
        "A join with no ON clause - you have written a cross product.",
        "AND and OR mixed without brackets - precedence is probably not what you meant.",
        "GROUP BY missing a selected column.",
        "LIMIT without a deterministic ORDER BY - the rows you get can vary between runs.",
      ],
    },
    {
      heading: "Formatting is not validation",
      body: [
        "Unlike JSON, where laying it out proves the syntax is correct, a SQL formatter works from a fairly shallow reading of the text.",
        "It will happily format a query referencing a table that does not exist, a column misspelled, or a function belonging to a different database engine. Clean output means the brackets balance and the keywords are where a formatter expects. It does not mean the query runs.",
        "The only way to know a query works is to run it - against a copy, with a LIMIT, inside a transaction you can roll back, or all three.",
      ],
    },
    {
      heading: "Dialects differ more than they look",
      body: [
        "SQL is a standard that no two databases implement identically, and formatters have to make assumptions.",
        "Quoting is the visible difference: double quotes for identifiers in Postgres, backticks in MySQL, square brackets in SQL Server. Then there are dialect-specific constructs - Postgres casting with a double colon, MySQL and Postgres disagreeing about LIMIT and OFFSET syntax, and every engine having its own date functions.",
        "A formatter aiming to be general will handle common SQL well and may lay out unusual dialect syntax awkwardly. If output looks wrong, check whether the construct is standard before assuming the formatter is broken.",
      ],
    },
    {
      heading: "When not to reformat",
      body: [
        "Queries in version control. Reformatting a large query produces a diff touching every line, which buries the change you actually made and makes review harder. If a project has a house style, follow it.",
        "Queries with meaningful comments and spacing. A formatter can move comments away from the lines they describe.",
        "The useful habit is to format queries you are reading and trying to understand, and leave queries you are committing in whatever form the team has agreed.",
      ],
    },
  ],
  example: {
    title: "A cross product hiding on one line",
    input: "SELECT u.name, o.total FROM users u, orders o WHERE o.status = 'paid' AND u.active = true OR u.role = 'admin' ORDER BY o.total DESC LIMIT 10",
    output: "SELECT u.name,\n       o.total\n  FROM users u,\n       orders o          <- no join condition\n WHERE o.status = 'paid'\n   AND u.active = true\n    OR u.role = 'admin'   <- binds as (status AND active) OR role\n ORDER BY o.total DESC\n LIMIT 10",
    note: "Two serious problems, both invisible on one line. There is no condition linking users to orders, so every user is paired with every order - a thousand users and a thousand orders gives a million rows before filtering. And the OR means an admin matches regardless of order status, which is almost certainly not what was intended. The query runs fine and returns ten rows, which is why nobody notices.",
  },
  limitations: [
    "Formatting does not validate. A query can format perfectly and still reference a table that does not exist.",
    "Dialect handling is general. Vendor-specific syntax may be laid out awkwardly even though it is correct.",
    "Comments and deliberate spacing can be moved, since they carry no structural meaning to a formatter.",
    "There is no query analysis, no execution plan and no performance advice - use your database's own EXPLAIN for that.",
    "Very long queries are limited by browser memory rather than by the formatter.",
  ],
};

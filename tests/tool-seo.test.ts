import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { catalog } from "../src/lib/tool-catalog";
import { createToolMetadata } from "../src/lib/tool-metadata";
import { createToolSchema, serializeToolSchema } from "../src/lib/tool-schema";

test("every tool delegates social metadata and renders through ToolLayout without a competing page schema", () => {
  for (const tool of catalog) {
    const path = `src/app${tool.href}/page.tsx`;
    const text = readFileSync(path, "utf8");
    const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const metadata = source.statements.filter(ts.isVariableStatement)
      .flatMap(statement => statement.declarationList.declarations)
      .find(declaration => declaration.name.getText(source) === "metadata");
    assert.ok(metadata?.initializer && ts.isCallExpression(metadata.initializer), tool.href);
    assert.equal(metadata.initializer.expression.getText(source), "createToolMetadata", tool.href);
    assert.equal((metadata.initializer.arguments[0] as ts.StringLiteral).text, tool.href);
    assert.doesNotMatch(text, /application\/ld\+json|ToolStructuredData|jsonLd/, tool.href);
    const componentImports = source.statements.filter(ts.isImportDeclaration)
      .map(statement => (statement.moduleSpecifier as ts.StringLiteral).text)
      .filter(path => path.startsWith("@/components/tools/"));
    assert.ok(componentImports.length, tool.href);
    assert.ok(componentImports.some(path => readFileSync(`src/${path.slice(2)}.tsx`, "utf8").includes("<ToolLayout")), tool.href);
  }
});

test("tool social cards have the page canonical URL, description, and explicit image on both platforms", () => {
  for (const tool of catalog) {
    const metadata = createToolMetadata(tool.href, { title: tool.title, description: tool.desc });
    assert.equal(metadata.openGraph?.url, metadata.alternates?.canonical);
    assert.equal(metadata.openGraph?.description, tool.desc);
    assert.equal(metadata.twitter?.description, tool.desc);
    assert.ok(Array.isArray(metadata.openGraph?.images) && metadata.openGraph.images.length);
    assert.ok(Array.isArray(metadata.twitter?.images) && metadata.twitter.images.length);
    assert.ok(JSON.stringify(metadata.openGraph?.images).includes(`/og/${tool.id}`));
    assert.deepEqual(metadata.openGraph?.images, metadata.twitter?.images);
    assert.ok(String(metadata.alternates?.canonical).endsWith(tool.href));
  }
});

test("structured data uses visible tool and FAQ text, without imaginary questions, ratings, or instructions", () => {
  const content = { tool: catalog[0], title: "Visible tool title", description: "Visible description", categoryLabel: "Visible category", faqs: [] as Array<{ question: string; answer: string }> };
  const noFaq = createToolSchema(content)["@graph"];
  assert.deepEqual(noFaq.map(node => node["@type"]), ["WebApplication", "BreadcrumbList"]);
  assert.equal(noFaq[0].name, content.title);
  assert.equal(noFaq[0].description, content.description);
  assert.equal(noFaq[0].isAccessibleForFree, true);
  assert.ok(!JSON.stringify(noFaq).match(/aggregateRating|HowTo|Service|FAQPage/));
  content.faqs = [{ question: "Visible question?", answer: "Visible answer </script><script>alert(1)</script>" }];
  const serialized = serializeToolSchema(content);
  assert.ok(!serialized.includes("</script>"));
  const graph = JSON.parse(serialized)["@graph"];
  assert.equal(graph.filter((node: Record<string, unknown>) => node["@type"] === "BreadcrumbList").length, 1);
  assert.deepEqual(graph.find((node: Record<string, unknown>) => node["@type"] === "FAQPage").mainEntity, [{
    "@type": "Question", name: content.faqs[0].question, acceptedAnswer: { "@type": "Answer", text: content.faqs[0].answer },
  }]);
  assert.equal(graph[1].itemListElement[1].name, content.categoryLabel);
  assert.equal(graph[1].itemListElement[2].name, content.title);
});

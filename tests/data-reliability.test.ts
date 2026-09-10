import assert from "node:assert/strict";
import test from "node:test";
import { parseSafeJson, sortJsonKeys } from "../src/lib/json-safe";
import { encodeBase64, decodeBase64, transformEncoding } from "../src/lib/encoding";
import { csvToJson, jsonToCsv, jsonToTypescript } from "../src/lib/data-workflows";
import { validateJsonSchema } from "../src/lib/schema-validation";
import { validateFile } from "../src/lib/file-validation";
import { restructurePdf } from "../src/lib/pdf-target";
import { safeToolEvent } from "../src/lib/tool-events";
import { sanitizePreferences } from "../src/lib/tool-preferences";
import { prepareHandoff, takeHandoff, clearHandoff } from "../src/lib/local-handoff";
import { queryJsonPath } from "../src/components/tools/dev/json-formatter/useJsonFormatter";

test("JSON rejects precision loss, duplicate keys, deep inputs and malformed syntax", () => {
  for (const input of ['{"id":9007199254740993}', '{"x":1.234567890123456789}', '{"x":1e400}', '{"x":-0}', '{"x":1,"x":2}', '{"x":1,"x":1}', '{"a":{"x":1,"x":2}}', '[1,]', '//comment\n{}', '['.repeat(65)+'0'+']'.repeat(65)]) assert.throws(() => parseSafeJson(input), input);
});
test("JSON scalar roots, safe numbers, escaped braces and prototype keys", () => {
  for (const input of ['false','0','null','""','{"id":9007199254740991}', '{"x":0.1}', '{"x":"[\\\"{]"}']) assert.deepEqual(parseSafeJson(input), JSON.parse(input));
  const value = parseSafeJson('{"__proto__":{"polluted":true},"constructor":2}');
  const sorted = sortJsonKeys(value);
  assert.equal(JSON.stringify(sorted).includes('"__proto__"'), true);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
  assert.equal(queryJsonPath({}, "constructor").error?.includes("not found"), true);
});
test("UTF-8 Base64 round trips whitespace, emoji and multilingual text", () => {
  for (const input of ['','  ','Hello','नमस्ते 🌍','你好','é','a\0b']) assert.equal(decodeBase64(encodeBase64(input)), input);
  assert.equal(decodeBase64('8J-YgA'), '😀');
  for (const input of ['!', 'a', '/w==', '====']) assert.throws(() => decodeBase64(input));
  assert.throws(() => encodeBase64('\ud800'));
});
test("URL and form handling preserves unicode, equals and repeated pairs; rejects bad escapes", () => {
  assert.equal(transformEncoding(transformEncoding('नमस्ते & x=y','urlComponent',true),'urlComponent',false),'नमस्ते & x=y');
  assert.equal(transformEncoding('x=a=b&x=hello world','formData',true),'x=a%3Db&x=hello+world');
  assert.equal(transformEncoding('x=a%3Db&x=hello+world','formData',false),'x=a=b&x=hello world');
  assert.equal(transformEncoding('flag','formData',false),'flag');
  assert.throws(() => transformEncoding('%E0%A4','urlComponent',false));
  assert.equal(transformEncoding(transformEncoding('日本語','base64',true),'base64',false),'日本語');
});
test("CSV text: quotes, multiline, delimiters, no number guessing", () => {
  const input = '[{"id":"001","note":"a,b\\nline \\"quote\\""}]';
  const value = [{id:'001',note:'a,b\nline "quote"'}];
  for (const delimiter of [',',';','\t']) assert.deepEqual(JSON.parse(csvToJson(jsonToCsv(JSON.stringify(value),delimiter),delimiter)),value);
  assert.deepEqual(JSON.parse(csvToJson('id\n9007199254740993')), [{id:'9007199254740993'}]);
  assert.throws(() => csvToJson('x,x\n1,2'));
  assert.throws(() => csvToJson('x,y\n1'));
  assert.throws(() => csvToJson('x\n"unclosed'));
  assert.throws(() => jsonToCsv('[{"x":{}}]'));
});
test("CSV typed mode preserves null/missing/nesting and special keys", () => {
  const value = JSON.parse('[{"a":null,"b":"","nested":[1,true],"__proto__":"x"},{"b":"null","nested":{"x":2}}]');
  assert.deepEqual(JSON.parse(csvToJson(jsonToCsv(JSON.stringify(value),',','json-cells'),',','json-cells')),value);
  assert.ok(jsonToCsv('[{"name":"=SUM(A1)"}]').includes("'=SUM(A1)"));
  assert.ok(!jsonToCsv('[{"name":"=SUM(A1)"}]',',','text',false).includes("'=SUM(A1)"));
});
test("Type inference handles escaped keys, mixed arrays and empty arrays", () => {
  const result = jsonToTypescript('{"a\\\"b":[1,"x",null],"empty":[],"nested":{"ok":true}}');
  assert.ok(result.includes('"a\\\"b": Array<number | string | null>'));
  assert.ok(result.includes('"empty": unknown[]'));
  assert.ok(result.includes('"ok": boolean'));
  assert.throws(() => jsonToTypescript('{"x":9007199254740993}'));
});
test("Schema validation does not repair data or retrieve remote refs", () => {
  assert.match(validateJsonSchema('{"age":2}','{"type":"object","properties":{"age":{"type":"number"}},"required":["age"]}'),/^Valid/);
  assert.match(validateJsonSchema('{"age":"2"}','{"type":"object","properties":{"age":{"type":"number"}}}'),/must be number/);
  assert.throws(() => validateJsonSchema('{}','{"$ref":"https://example.com/schema"}'),/local/);
  assert.throws(() => validateJsonSchema('{}','{"$schema":"https://json-schema.org/draft/2020-12/schema"}'),/draft-07/);
  assert.match(validateJsonSchema('1','false'),/boolean schema/);
  assert.match(validateJsonSchema('"not-an-email"','{"type":"string","format":"email"}'),/^Valid/);
});
test("file failures reject empty, oversized, wrong MIME and corrupt PDF", async () => {
  assert.match(validateFile({name:'x.pdf',type:'application/pdf',size:0},'.pdf',100)!,/empty/);
  assert.match(validateFile({name:'x.pdf',type:'application/pdf',size:101},'.pdf',100)!,/limit/);
  assert.match(validateFile({name:'x.txt',type:'text/plain',size:10},'image/*',100)!,/type/);
  assert.equal(validateFile({name:'x.JPG',type:'',size:10},'.jpg',100),null);
  await assert.rejects(restructurePdf(new Blob(['not a PDF'])));
});
test("telemetry and preferences cannot retain user payloads", () => {
  const marker='SECRET_PAYLOAD';
  const safe=safeToolEvent('dev-json-formatter','tool_run_failed',{input:marker,url:marker,filename:marker,error:marker,surface:marker,durationMs:120});
  assert.ok(!JSON.stringify(safe).includes(marker));
  assert.equal(safeToolEvent(marker,'tool_ready'),null);
  assert.equal(safeToolEvent('dev-json-formatter',marker),null);
  assert.deepEqual(sanitizePreferences({pinned:['dev-json-formatter',marker,'dev-json-formatter'],recent:[marker],focus:true,input:marker}),{pinned:['dev-json-formatter'],recent:[],focus:true,compact:false});
});
test("handoff is one-shot, destination-specific and local-only", () => {
  clearHandoff(); prepareHandoff('/dev-tools/json-schema','{"x":1}');
  assert.equal(takeHandoff('/dev-tools/json-csv'),undefined);
  assert.equal(takeHandoff('/dev-tools/json-schema'),'{"x":1}');
  assert.equal(takeHandoff('/dev-tools/json-schema'),undefined);
  assert.throws(() => prepareHandoff('/dev-tools/api-client','secret'));
});

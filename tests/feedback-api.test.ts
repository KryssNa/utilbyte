import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/feedback/route';
import { catalog } from '../src/lib/tool-catalog';

const originalFetch = globalThis.fetch;
const originalWebhook = process.env.SLACK_WEBHOOK_URL;
const tool = catalog.find(item => item.href === '/dev-tools/json-csv')!;
function request(body: unknown, sender: string) {
  return new NextRequest('https://utilbyte.test/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': sender }, body: JSON.stringify(body) });
}
test.beforeEach(() => { process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.test/mock'; });
test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalWebhook === undefined) delete process.env.SLACK_WEBHOOK_URL;
  else process.env.SLACK_WEBHOOK_URL = originalWebhook;
});

test('feedback sends only the comment and catalog identity through the existing Slack setting', async () => {
  let sent: Record<string, unknown> | undefined;
  globalThis.fetch = (async (url, init) => {
    assert.equal(url, 'https://hooks.slack.test/mock');
    sent = JSON.parse(String(init?.body));
    return new Response('ok');
  }) as typeof fetch;
  const result = await POST(request({ toolId: tool.id, message: '  Easier controls please\n<!channel>  ', input: 'DO_NOT_SEND', email: 'DO_NOT_SEND', url: 'DO_NOT_SEND' }, 'success'));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { success: true });
  const payload = sent as { blocks: { text: { type: string; text: string } }[] } | undefined;
  assert.equal(payload?.blocks[2].text.type, 'plain_text');
  assert.equal(payload?.blocks[2].text.text, 'Easier controls please\n<!channel>');
  assert.equal(payload?.blocks[1].text.text, `${tool.title}\nhttps://utilbyte.app${tool.href}`);
  assert.equal(JSON.stringify(sent).includes('DO_NOT_SEND'), false);
});

test('feedback rejects invalid input and ignores the spam trap without contacting Slack', async () => {
  globalThis.fetch = (async () => { assert.fail('Must not send to Slack'); }) as typeof fetch;
  for (const body of [null, [], { toolId: 'missing', message: 'hello' }, { toolId: tool.id, message: ' ' }, { toolId: tool.id, message: 'x'.repeat(2001) }, { toolId: tool.id, message: 123 }]) {
    assert.equal((await POST(request(body, 'invalid'))).status, 400);
  }
  assert.equal((await POST(request({ toolId: tool.id, message: 'hello', website: 'bot.example' }, 'bot'))).status, 200);
  const invalidJSON = new NextRequest('https://utilbyte.test/api/feedback', { method: 'POST', body: '{' });
  assert.equal((await POST(invalidJSON)).status, 400);
});

test('feedback reports missing configuration and upstream failure without claiming delivery', async () => {
  delete process.env.SLACK_WEBHOOK_URL;
  assert.equal((await POST(request({ toolId: tool.id, message: 'hello' }, 'config'))).status, 503);
  process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.test/mock';
  globalThis.fetch = (async () => new Response('failed', { status: 500 })) as typeof fetch;
  assert.equal((await POST(request({ toolId: tool.id, message: 'hello' }, 'failure'))).status, 502);
  globalThis.fetch = (async () => { throw new Error('Network unavailable'); }) as typeof fetch;
  assert.equal((await POST(request({ toolId: tool.id, message: 'hello' }, 'network'))).status, 502);
});

test('feedback limits repeated posts without extra infrastructure', async () => {
  let sends = 0;
  globalThis.fetch = (async () => { sends++; return new Response('ok'); }) as typeof fetch;
  for (let i = 0; i < 5; i++) assert.equal((await POST(request({ toolId: tool.id, message: 'hello' }, 'rate-limit'))).status, 200);
  const limited = await POST(request({ toolId: tool.id, message: 'hello' }, 'rate-limit'));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '300');
  assert.equal(sends, 5);
});

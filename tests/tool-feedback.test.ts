import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';
import { catalog } from '../src/lib/tool-catalog';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://utilbyte.test' });
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'FormData'] as const) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const { render, fireEvent, cleanup, act } = require('@testing-library/react') as typeof import('@testing-library/react');
const ToolFeedback = require('../src/components/shared/ToolFeedback').default as typeof import('../src/components/shared/ToolFeedback').default;
const tool = catalog.find(item => item.href === '/dev-tools/json-csv')!;
const originalFetch = globalThis.fetch;
test.afterEach(() => { cleanup(); globalThis.fetch = originalFetch; });

test('feedback stays inline, preserves drafts on close, and lets the user work while sending', async () => {
  let resolveSend!: (response: Response) => void;
  let sent: unknown;
  globalThis.fetch = (async (_url, init) => {
    sent = JSON.parse(String(init?.body));
    return new Promise<Response>(resolve => { resolveSend = resolve; });
  }) as typeof fetch;
  const view = render(React.createElement('div', null, React.createElement(ToolFeedback, { tool }), React.createElement('textarea', { 'aria-label': 'Tool input', defaultValue: 'private fixture' })));
  const toolInput = view.getByLabelText('Tool input') as HTMLTextAreaElement;
  const trigger = view.getByRole('button', { name: 'Feedback' });
  fireEvent.click(trigger);
  assert.equal(view.queryByRole('dialog'), null);
  const comment = view.getByLabelText(`Help improve ${tool.title}`) as HTMLTextAreaElement;
  fireEvent.change(comment, { target: { value: 'Please add a delimiter preview' } });
  fireEvent.click(view.getByRole('button', { name: 'Close feedback' }));
  assert.equal(document.activeElement, trigger);
  fireEvent.click(trigger);
  assert.equal((view.getByLabelText(`Help improve ${tool.title}`) as HTMLTextAreaElement).value, 'Please add a delimiter preview');
  fireEvent.submit(view.getByRole('button', { name: 'Send feedback' }).closest('form')!);
  toolInput.focus();
  fireEvent.change(toolInput, { target: { value: 'still working' } });
  await act(async () => { resolveSend(new Response(JSON.stringify({ success: true }))); });
  assert.equal(toolInput.value, 'still working');
  assert.equal(document.activeElement, toolInput);
  assert.deepEqual(sent, { toolId: tool.id, message: 'Please add a delimiter preview', website: '' });
  assert.match(view.getByRole('status').textContent || '', /feedback was sent/);
});

test('failed feedback preserves the comment for retry', async () => {
  globalThis.fetch = (async () => new Response('{}', { status: 502 })) as typeof fetch;
  const view = render(React.createElement(ToolFeedback, { tool }));
  fireEvent.click(view.getByRole('button', { name: 'Feedback' }));
  const comment = view.getByLabelText(`Help improve ${tool.title}`) as HTMLTextAreaElement;
  fireEvent.change(comment, { target: { value: 'Please improve the preview' } });
  await act(async () => { fireEvent.submit(view.getByRole('button', { name: 'Send feedback' }).closest('form')!); });
  assert.equal(comment.value, 'Please improve the preview');
  assert.match(view.getByRole('alert').textContent || '', /Your comment is still here/);
  assert.equal((view.getByRole('button', { name: 'Send feedback' }) as HTMLButtonElement).disabled, false);
});

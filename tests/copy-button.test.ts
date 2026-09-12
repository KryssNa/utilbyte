import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://utilbyte.test' });
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event'] as const) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const { render, fireEvent, cleanup, act } = require('@testing-library/react') as typeof import('@testing-library/react');
const CopyButton = require('../src/components/shared/CopyButton').default as typeof import('../src/components/shared/CopyButton').default;
const setClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { configurable: true, value });
test.afterEach(cleanup);

test('copy preserves exact whitespace and only confirms after the clipboard accepts it', async () => {
  const value = "SELECT 'a  b' -- keep comment\nWHERE id = 1;\n";
  let received = '', finish!: () => void;
  setClipboard({ writeText: (text: string) => { received = text; return new Promise<void>(resolve => { finish = resolve; }); } });
  const view = render(React.createElement(CopyButton, { value, label: 'SQL example' }));
  fireEvent.click(view.getByRole('button', { name: 'Copy SQL example' }));
  assert.equal(received, value);
  assert.equal(view.queryByText('Copied'), null);
  assert.equal((view.getByRole('button') as HTMLButtonElement).disabled, true);
  await act(async () => { finish(); });
  assert.equal(view.getByRole('status').textContent, 'SQL example copied to clipboard.');
  assert.equal((view.getByRole('button') as HTMLButtonElement).disabled, false);
});

test('unavailable or rejected clipboard never claims success and permits retry', async () => {
  const view = render(React.createElement(CopyButton, { value: 'https://utilbyte.app/mcp', label: 'MCP server URL' }));
  for (const clipboard of [undefined, { writeText: async () => { throw new Error('Denied'); } }]) {
    setClipboard(clipboard);
    await act(async () => { fireEvent.click(view.getByRole('button')); });
    assert.match(view.getByRole('status').textContent || '', /Select the text and copy it manually/);
    assert.equal(view.queryByText('Copied'), null);
  }
  setClipboard({ writeText: async () => {} });
  await act(async () => { fireEvent.click(view.getByRole('button')); });
  assert.equal(view.getByRole('status').textContent, 'MCP server URL copied to clipboard.');
});

test('completion for an old value cannot report that the replacement value was copied', async () => {
  let finish!: () => void;
  setClipboard({ writeText: () => new Promise<void>(resolve => { finish = resolve; }) });
  const view = render(React.createElement(CopyButton, { value: 'first', label: 'result' }));
  fireEvent.click(view.getByRole('button'));
  view.rerender(React.createElement(CopyButton, { value: 'second', label: 'result' }));
  await act(async () => { finish(); });
  assert.equal(view.queryByText('Copied'), null);
  assert.equal(view.getByRole('status').textContent, '');
});

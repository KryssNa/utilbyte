import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM('<!doctype html><html><body><button id="opener">Search</button></body></html>', { url: 'https://utilbyte.test', pretendToBeVisual: true });
for (const key of ['window', 'self', 'document', 'HTMLElement', 'Element', 'Node', 'NodeFilter', 'HTMLInputElement', 'HTMLAnchorElement', 'MutationObserver', 'CustomEvent', 'Event', 'MouseEvent', 'KeyboardEvent', 'localStorage', 'getComputedStyle'] as const) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const { render, fireEvent, cleanup, act } = require('@testing-library/react') as typeof import('@testing-library/react');
const { SearchModal } = require('../src/components/layout/navbar/SearchModal') as typeof import('../src/components/layout/navbar/SearchModal');

test('search filters results and recovers from empty results without closing', () => {
  const view = render(React.createElement(SearchModal, { isOpen: true, onClose: () => assert.fail('Should stay open') }));
  const input = view.getByRole('searchbox', { name: 'Search tools' });
  assert.equal(document.activeElement, input);
  fireEvent.change(input, { target: { value: 'postgres' } });
  assert.ok(view.getByRole('link', { name: /SQL Formatter/ }));
  fireEvent.click(view.getByRole('button', { name: /^Image$/ }));
  assert.ok(view.getByText('No matching tools'));
  fireEvent.click(view.getByRole('button', { name: 'Clear filters and start again' }));
  assert.equal((input as HTMLInputElement).value, '');
  assert.equal(view.getByRole('button', { name: /^All tools$/ }).getAttribute('aria-pressed'), 'true');
  assert.equal(document.activeElement, input);
  cleanup();
});

test('arrow navigation returns to the field and composition does not open a result', () => {
  let closed = 0;
  const view = render(React.createElement(SearchModal, { isOpen: true, onClose: () => closed++ }));
  const input = view.getByRole('searchbox');
  fireEvent.change(input, { target: { value: 'json' } });
  const first = view.getAllByRole('link')[0];
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  assert.equal(closed, 0);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  assert.equal(document.activeElement, first);
  fireEvent.keyDown(first, { key: 'ArrowUp' });
  assert.equal(document.activeElement, input);
  first.addEventListener('click', event => event.preventDefault());
  fireEvent.keyDown(input, { key: 'Enter' });
  assert.equal(closed, 1);
  cleanup();
});

test('Escape restores focus and reopening resets filters', async () => {
  const opener = document.getElementById('opener')!;
  opener.focus();
  function Harness() {
    const [open, setOpen] = React.useState(true);
    return React.createElement(React.Fragment, null,
      React.createElement('button', { onClick: () => setOpen(true) }, 'Reopen'),
      React.createElement(SearchModal, { isOpen: open, onClose: () => setOpen(false) }));
  }
  const view = render(React.createElement(Harness));
  fireEvent.change(view.getByRole('searchbox'), { target: { value: 'sql' } });
  fireEvent.keyDown(view.getByRole('searchbox'), { key: 'Escape' });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
  assert.equal(view.queryByRole('dialog'), null);
  assert.equal(document.activeElement, opener);
  fireEvent.click(view.getByRole('button', { name: 'Reopen' }));
  assert.equal((view.getByRole('searchbox') as HTMLInputElement).value, '');
  cleanup();
});

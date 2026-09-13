import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://utilbyte.test/dev-tools/sql-formatter' });
for (const key of ['window','self','document','history','location','HTMLElement','Element','Node','MouseEvent','PopStateEvent','Event','HTMLAnchorElement'] as const) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const { render, fireEvent, act, cleanup } = require('@testing-library/react') as typeof import('@testing-library/react');
const { NavigationSafety, useDraftGuard } = require('../src/components/shared/NavigationSafety') as typeof import('../src/components/shared/NavigationSafety');

function Draft({ changed }: { changed: boolean }) {
  useDraftGuard(changed);
  return React.createElement('textarea', { 'aria-label': 'Draft', defaultValue: 'SELECT secret_test_fixture' });
}

test('navigation preserves drafts when cancelled; permits confirmed links, downloads and new tabs', async () => {
  let prompts = 0, navigations = 0;
  window.confirm = () => { prompts++; return false; };
  const view = render(React.createElement(NavigationSafety, null,
    React.createElement(Draft, { changed: true }),
    React.createElement('a', { href: '/dev-tools/json-formatter', onClick: (e: React.MouseEvent) => { e.preventDefault(); navigations++; } }, 'Other tool'),
    React.createElement('a', { href: '/fixture.sql', download: 'fixture.sql', onClick: (e: React.MouseEvent) => e.preventDefault() }, 'Download'),
  ));
  fireEvent.click(view.getByText('Other tool'));
  assert.equal(prompts, 1); assert.equal(navigations, 0);
  assert.equal((view.getByLabelText('Draft') as HTMLTextAreaElement).value, 'SELECT secret_test_fixture');
  fireEvent.click(view.getByText('Download'));
  assert.equal(prompts, 1);
  fireEvent.click(view.getByText('Other tool'), { ctrlKey: true });
  assert.equal(prompts, 1);
  window.confirm = () => { prompts++; return true; };
  fireEvent.click(view.getByText('Other tool'));
  assert.equal(navigations, 2);
  assert.equal(prompts, 2);
  cleanup();
});

test('cancelled browser back restores the original history entry and draft', async () => {
  window.history.replaceState({}, '', '/dev-tools/sql-formatter');
  const view = render(React.createElement(NavigationSafety, null, React.createElement(Draft, {changed:true})));
  window.history.pushState({ nextState: 'preserved' }, '', '/dev-tools/json-formatter');
  const beforeLength = history.length;
  let prompts = 0;
  window.confirm = () => { prompts++; return false; };
  await act(async () => {
    history.back();
    await new Promise(resolve => setTimeout(resolve, 80));
  });
  assert.equal(location.pathname, '/dev-tools/json-formatter');
  assert.equal(history.state.nextState, 'preserved');
  assert.equal(history.length, beforeLength);
  assert.equal(prompts, 1);
  assert.equal((view.getByLabelText('Draft') as HTMLTextAreaElement).value, 'SELECT secret_test_fixture');
  window.confirm = () => true;
  await act(async () => { history.back(); await new Promise(resolve => setTimeout(resolve, 40)); });
  assert.equal(location.pathname, '/dev-tools/sql-formatter');
  cleanup();
});

test('reload is guarded only while a draft exists', () => {
  const view = render(React.createElement(NavigationSafety, null, React.createElement(Draft, {changed:true})));
  const event = new window.Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  view.rerender(React.createElement(NavigationSafety, null, React.createElement(Draft, {changed:false})));
  const clean = new window.Event('beforeunload', { cancelable: true });
  window.dispatchEvent(clean);
  assert.equal(clean.defaultPrevented, false);
  cleanup();
});

test('sidebar searches in place, supports aliases and keyboard selection without disturbing a draft', () => {
  const ToolNavigator = require('../src/components/shared/ToolNavigator').default as typeof import('../src/components/shared/ToolNavigator').default;
  const { catalog } = require('../src/lib/tool-catalog') as typeof import('../src/lib/tool-catalog');
  const tool = catalog.find(item => item.href === '/dev-tools/sql-formatter')!;
  let modalOpens = 0;
  const onModal = () => { modalOpens++; };
  window.addEventListener('utilbyte:open-tool-search', onModal);
  const selected: string[] = [];
  const view = render(React.createElement('div', { onClick: (event: React.MouseEvent) => { if ((event.target as Element).closest('a')) event.preventDefault(); } },
    React.createElement(ToolNavigator, { tool, prefs: { pinned: [], recent: [], focus: false, compact: false }, onNavigate: item => selected.push(item.href) }),
    React.createElement('textarea', { 'aria-label': 'Working draft', defaultValue: 'SELECT 42' }),
  ));
  const draft = view.getByLabelText('Working draft');
  const search = view.getByLabelText('Search in sidebar');
  fireEvent.change(search, { target: { value: 'shrink image' } });
  assert.equal(view.getByRole('status').textContent, '1 tool found');
  assert.ok(view.getByRole('link', { name: /Image Compressor/ }));
  assert.equal(modalOpens, 0);
  fireEvent.keyDown(search, { key: 'Enter', isComposing: true });
  assert.equal(selected.length, 0);
  fireEvent.keyDown(search, { key: 'ArrowDown' });
  assert.equal(document.activeElement, view.getByRole('link', { name: /Image Compressor/ }));
  fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
  assert.equal(document.activeElement, search);
  fireEvent.keyDown(search, { key: 'Enter' });
  assert.deepEqual(selected, ['/image-tools/compress-image']);
  fireEvent.change(search, { target: { value: 'zzzzdoesnotexist' } });
  assert.ok(view.getByText('No matching tools'));
  fireEvent.click(view.getByRole('button', { name: 'Show all tools' }));
  assert.equal(view.getByRole('link', { name: 'SQL Formatter' }).getAttribute('aria-current'), 'page');
  assert.equal(view.getByLabelText('Working draft'), draft);
  assert.equal((draft as HTMLTextAreaElement).value, 'SELECT 42');
  window.removeEventListener('utilbyte:open-tool-search', onModal);
  cleanup();
});

test('sidebar category switching and clearing search keep navigation accessible', () => {
  const ToolNavigator = require('../src/components/shared/ToolNavigator').default as typeof import('../src/components/shared/ToolNavigator').default;
  const { catalog } = require('../src/lib/tool-catalog') as typeof import('../src/lib/tool-catalog');
  const tool = catalog.find(item => item.href === '/dev-tools/sql-formatter')!;
  const view = render(React.createElement(ToolNavigator, { tool, prefs: { pinned: [], recent: [], focus: false, compact: false }, onNavigate: () => {} }));
  fireEvent.click(view.getByRole('button', { name: /^Image/ }));
  assert.ok(view.getByRole('link', { name: 'Image Compressor' }));
  const search = view.getByLabelText('Search in sidebar');
  fireEvent.change(search, { target: { value: 'json' } });
  assert.ok(view.getByRole('link', { name: /^JSON Formatter/ }));
  fireEvent.click(view.getByRole('button', { name: 'Clear sidebar search' }));
  assert.equal(document.activeElement, search);
  assert.equal(view.getByRole('button', { name: /^Image/ }).getAttribute('aria-pressed'), 'true');
  assert.ok(view.getByRole('link', { name: 'Image Compressor' }));
  cleanup();
});

test('legacy preferences cannot collapse the desktop navigator', () => {
  const { sanitizePreferences } = require('../src/lib/tool-preferences') as typeof import('../src/lib/tool-preferences');
  assert.equal(sanitizePreferences({ compact: true, focus: true }).compact, false);
  assert.equal(sanitizePreferences({ compact: true, focus: true }).focus, true);
});

test('choosing a file is keyboard accessible and cancelling selection does not create a draft', () => {
  const ToolShell = require('../src/components/shared/ToolShell').default as typeof import('../src/components/shared/ToolShell').default;
  const FileDropZone = require('../src/components/shared/FileDropZone').default as typeof import('../src/components/shared/FileDropZone').default;
  const { catalog } = require('../src/lib/tool-catalog') as typeof import('../src/lib/tool-catalog');
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  const view = render(React.createElement(NavigationSafety, null,
    React.createElement(ToolShell, { tool: catalog.find(item => item.href === '/image-tools/compress-image'), isWorking: false, children:
      React.createElement('section', { 'data-tool-workspace': true }, React.createElement(FileDropZone, { accept: 'image/*' })) }),
  ));
  const fileInput = view.container.querySelector<HTMLInputElement>('input[type="file"]')!;
  let pickerOpens = 0;
  fileInput.click = () => { pickerOpens++; };
  const choose = view.getByRole('button', { name: 'Choose file' });
  choose.focus();
  assert.equal(document.activeElement, choose);
  fireEvent.click(choose);
  assert.equal(pickerOpens, 1);
  const clean = new window.Event('beforeunload', { cancelable: true });
  window.dispatchEvent(clean);
  assert.equal(clean.defaultPrevented, false);
  cleanup();
  window.matchMedia = originalMatchMedia;
});

test('home sidebar exposes the whole catalog without marking an unrelated tool active', () => {
  const ToolNavigator = require('../src/components/shared/ToolNavigator').default as typeof import('../src/components/shared/ToolNavigator').default;
  const { catalog } = require('../src/lib/tool-catalog') as typeof import('../src/lib/tool-catalog');
  const view = render(React.createElement(ToolNavigator, { prefs: { pinned: [], recent: [], focus: false, compact: false }, onNavigate: () => {} }));
  assert.equal(view.container.querySelectorAll('a[aria-current="page"]').length, 0);
  for (const tool of catalog) assert.ok(view.container.querySelector(`a[href="${tool.href}"]`), tool.href);
  fireEvent.click(view.getByRole('button', { name: /^Developer/ }));
  assert.ok(view.getByRole('link', { name: 'SQL Formatter' }));
  assert.equal(view.queryByRole('link', { name: 'Image Compressor' }), null);
  fireEvent.click(view.getByRole('button', { name: /^All tools/ }));
  assert.ok(view.getByRole('link', { name: 'Image Compressor' }));
  cleanup();
});

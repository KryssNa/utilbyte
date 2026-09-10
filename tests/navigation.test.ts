import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://utilbyte.test/dev-tools/sql-formatter' });
for (const key of ['window','document','history','location','HTMLElement','Element','Node','MouseEvent','PopStateEvent','Event','HTMLAnchorElement'] as const) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
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

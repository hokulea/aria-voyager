import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Menu } from '#src';
import {
  appendRadioGroup,
  appendRadioItems,
  appendSeparator,
  createMenuElement
} from '#tests/components/menu';

test('removing separator merges groups, invariant corrects, emits', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);
  const [a, b] = appendRadioItems(menuElement, ['A', 'B']);

  const hr = appendSeparator(menuElement);

  const [c] = appendRadioItems(menuElement, ['C', 'D']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('initial state: two groups, each with first item checked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');

  await annotate('remove separator');
  hr.remove();

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('groups merged: A is first checked, C is unchecked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  await annotate('emitter should be called with A (first checked item in merged group)');
  expect(listeners.select).toHaveBeenCalledWith([a]);

  menu.dispose();
});

test('adding separator splits group, invariant corrects per new group', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const [a, b, c] = appendRadioItems(menuElement, ['A', 'B', 'C']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('insert separator between A and B to split group');

  const hr = document.createElement('hr');

  b.before(hr);
  menu.readItems();

  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  await annotate('emitter should be called with B (first item in new group)');
  expect(listeners.select).toHaveBeenCalledWith([a, b]);

  menu.dispose();
});

test('moving item between groups corrects both groups', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const g1 = appendRadioGroup(menuElement);
  const [a] = appendRadioItems(g1, ['A', 'B']);

  const g2 = appendRadioGroup(menuElement);
  const [c, d] = appendRadioItems(g2, ['C', 'D']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('remove C from group 2, D becomes solo item');
  c.remove();
  menu.readItems();

  await expect.element(d).toHaveAttribute('aria-checked', 'true');
  expect(listeners.select).toHaveBeenCalledWith([d]);

  listeners.select.mockReset();

  await annotate('move C into group 1, A stays checked');
  g1.append(c);
  menu.readItems();

  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');
  expect(listeners.select).toHaveBeenCalledWith([a]);

  menu.dispose();
});

test('items already valid after merge, no emission', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendRadioItems(menuElement, ['A', 'B']);

  const hr = appendSeparator(menuElement);

  const [c] = appendRadioItems(menuElement, ['C', 'D']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('uncheck C manually');
  c.setAttribute('aria-checked', 'false');

  await annotate('remove separator to merge groups');
  hr.remove();
  menu.readItems();

  await annotate('emitter should not be called (A already checked, no correction needed)');
  expect(listeners.select).not.toHaveBeenCalled();

  menu.dispose();
});

test('checkbox items unaffected by radio group re-partitioning', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const checkbox1 = document.createElement('button');

  checkbox1.type = 'button';
  checkbox1.role = 'menuitemcheckbox';
  checkbox1.setAttribute('aria-checked', 'true');
  checkbox1.append('Bold');
  menuElement.append(checkbox1);

  const [a] = appendRadioItems(menuElement, ['A', 'B']);

  const hr = appendSeparator(menuElement);

  const [c] = appendRadioItems(menuElement, ['C', 'D']);

  const menu = new Menu(menuElement);

  await annotate('checkbox is checked, radio groups initialized');
  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'true');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'true');

  await annotate('remove separator');
  hr.remove();

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('checkbox still checked, radios merged');
  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'true');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  menu.dispose();
});

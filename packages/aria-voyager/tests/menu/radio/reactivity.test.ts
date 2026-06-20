import { expect, test } from 'vitest';

import { Menu } from '#src';
import {
  appendRadioGroup,
  appendRadioItems,
  appendSeparator,
  createMenuElement
} from '#tests/components/menu';

import { fireKey } from '#tests/test-support/events';

test('removing separator merges groups, invariant corrects, emits', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);
  const [a, b] = appendRadioItems(menuElement, ['A', 'B']);

  const hr = appendSeparator(menuElement);

  const [c, d] = appendRadioItems(menuElement, ['C', 'D']);
  const menu = new Menu(menuElement);

  await annotate('initial state: two groups, each with first item checked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'true');
  await expect.element(d).toHaveAttribute('aria-checked', 'false');

  await annotate('remove separator');
  hr.remove();

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('groups merged: A is first checked, C is unchecked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');
  await expect.element(d).toHaveAttribute('aria-checked', 'false');

  await annotate('all items now in same group: selecting D unchecks A');
  d.focus();
  await fireKey(menuElement, ' ');

  await expect.element(a).toHaveAttribute('aria-checked', 'false');
  await expect.element(d).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('adding separator splits group, invariant corrects per new group', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const [a, b, c] = appendRadioItems(menuElement, ['A', 'B', 'C']);

  const menu = new Menu(menuElement);

  await annotate('initial state: one group, A checked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  await annotate('insert separator between A and B');

  const hr = document.createElement('hr');

  b.before(hr);

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('group 1: [A] — A still checked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');

  await annotate('group 2: [B, C] — B checked (first item, no checked before)');
  await expect.element(b).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  menu.dispose();
});

test('moving item between groups corrects both groups', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const g1 = appendRadioGroup(menuElement);
  const [a, b] = appendRadioItems(g1, ['A', 'B']);

  const g2 = appendRadioGroup(menuElement);
  const [c, d] = appendRadioItems(g2, ['C', 'D']);

  const menu = new Menu(menuElement);

  await annotate('initial state: group 1 [A checked, B], group 2 [C checked, D]');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'true');

  await annotate('move C from group 2 to group 1');
  g1.append(c);

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('group 1: [A, B, C] — A still checked, C unchecked');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');

  await annotate('group 2: [D] — D checked (invariant: no checked → check first)');
  await expect.element(d).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('items already valid after merge, no emission', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const [a, b] = appendRadioItems(menuElement, ['A', 'B']);

  const hr = appendSeparator(menuElement);

  const [c, d] = appendRadioItems(menuElement, ['C', 'D']);

  const menu = new Menu(menuElement);

  await annotate('initial state: two groups');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(c).toHaveAttribute('aria-checked', 'true');

  await annotate('uncheck C manually');
  c.setAttribute('aria-checked', 'false');

  await annotate('remove separator');
  hr.remove();

  await annotate('trigger re-read');
  menu.readItems();

  await annotate('merged group: A still checked, no correction needed');
  await expect.element(a).toHaveAttribute('aria-checked', 'true');
  await expect.element(b).toHaveAttribute('aria-checked', 'false');
  await expect.element(c).toHaveAttribute('aria-checked', 'false');
  await expect.element(d).toHaveAttribute('aria-checked', 'false');

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

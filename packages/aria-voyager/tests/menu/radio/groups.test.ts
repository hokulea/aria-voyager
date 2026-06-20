import { describe, expect, test } from 'vitest';

import { Menu } from '#src';
import {
  appendRadioGroup,
  appendRadioItems,
  appendSeparator,
  createMenuElement
} from '#tests/components/menu';

import { fireKey } from '#tests/test-support/events';

describe('Separator', () => {
  test('`<hr>` separates radio items into independent groups', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    const [a, b] = appendRadioItems(menuElement, ['A', 'B']);

    appendSeparator(menuElement);

    const [c, d] = appendRadioItems(menuElement, ['C', 'D']);

    const menu = new Menu(menuElement);

    await annotate('each group has its first item checked');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(b).toHaveAttribute('aria-checked', 'false');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    await annotate('selecting B in group 0 does not affect group 1');
    b.focus();
    await fireKey(menuElement, ' ');

    await expect.element(a).toHaveAttribute('aria-checked', 'false');
    await expect.element(b).toHaveAttribute('aria-checked', 'true');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    await annotate('selecting D in group 1 does not affect group 0');
    d.focus();
    await fireKey(menuElement, ' ');

    await expect.element(a).toHaveAttribute('aria-checked', 'false');
    await expect.element(b).toHaveAttribute('aria-checked', 'true');
    await expect.element(c).toHaveAttribute('aria-checked', 'false');
    await expect.element(d).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });

  test('`role="separator"` separates radio items into independent groups', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    const [a, b] = appendRadioItems(menuElement, ['A', 'B']);

    const sep = document.createElement('div');

    sep.role = 'separator';

    menuElement.append(sep);

    const [c, d] = appendRadioItems(menuElement, ['C', 'D']);

    const menu = new Menu(menuElement);

    await annotate('each group has its first item checked');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(b).toHaveAttribute('aria-checked', 'false');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    await annotate('selecting B in group 0 does not affect group 1');
    b.focus();
    await fireKey(menuElement, ' ');

    await expect.element(a).toHaveAttribute('aria-checked', 'false');
    await expect.element(b).toHaveAttribute('aria-checked', 'true');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    menu.dispose();
  });

  test('no separators means all items are one group', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    const [a, b, c] = appendRadioItems(menuElement, ['A', 'B', 'C']);

    const menu = new Menu(menuElement);

    await annotate('first item is checked by default');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(b).toHaveAttribute('aria-checked', 'false');
    await expect.element(c).toHaveAttribute('aria-checked', 'false');

    await annotate('selecting C unchecks A (same group)');
    c.focus();
    await fireKey(menuElement, ' ');

    await expect.element(a).toHaveAttribute('aria-checked', 'false');
    await expect.element(b).toHaveAttribute('aria-checked', 'false');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });
});

describe('role="group"', () => {
  test('items in different role="group" containers are independent radio groups', async ({
    annotate
  }) => {
    const menuElement = createMenuElement(document.body);

    const g1 = appendRadioGroup(menuElement);
    const [a, b] = appendRadioItems(g1, ['A', 'B']);

    const g2 = appendRadioGroup(menuElement);
    const [c, d] = appendRadioItems(g2, ['C', 'D']);

    const menu = new Menu(menuElement);

    await annotate('each group has its first item checked');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(b).toHaveAttribute('aria-checked', 'false');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    await annotate('selecting B in group 1 does not affect group 2');
    b.focus();
    await fireKey(menuElement, ' ');

    await expect.element(a).toHaveAttribute('aria-checked', 'false');
    await expect.element(b).toHaveAttribute('aria-checked', 'true');
    await expect.element(c).toHaveAttribute('aria-checked', 'true');
    await expect.element(d).toHaveAttribute('aria-checked', 'false');

    menu.dispose();
  });

  test('separator inside role="group" subdivides the group', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    const g1 = appendRadioGroup(menuElement);
    const [a] = appendRadioItems(g1, ['A']);

    appendSeparator(g1);

    const [b] = appendRadioItems(g1, ['B']);

    const menu = new Menu(menuElement);

    await annotate('each sub-group has its first item checked');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(b).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });

  test('items before and after a role="group" are in different groups', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    const [x] = appendRadioItems(menuElement, ['X']);

    const g = appendRadioGroup(menuElement);
    const [a] = appendRadioItems(g, ['A']);

    const [y] = appendRadioItems(menuElement, ['Y']);

    const menu = new Menu(menuElement);

    await annotate('each group has its first item checked');
    await expect.element(x).toHaveAttribute('aria-checked', 'true');
    await expect.element(a).toHaveAttribute('aria-checked', 'true');
    await expect.element(y).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });
});

import { expect, test } from 'vitest';

import { Menu } from '#src';
import { appendRadioItems, appendSeparator, createMenuElement } from '#tests/components/menu';

import { fireKey } from '#tests/test-support/events';

test('Use `Space` on menuitemradio checks it and unchecks siblings in same group', async ({
  annotate
}) => {
  const menuElement = createMenuElement(document.body);

  const [top, bottom] = appendRadioItems(menuElement, ['Top', 'Bottom']);

  const menu = new Menu(menuElement);

  await annotate('first radio item is checked by default');
  await expect.element(top).toHaveAttribute('aria-checked', 'true');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'false');

  await annotate('focus second radio item and press Space');
  bottom.focus();
  await fireKey(menuElement, ' ');

  await expect.element(top).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('Use `Space` does not affect radio items in other groups', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const [top, bottom] = appendRadioItems(menuElement, ['Top', 'Bottom']);

  appendSeparator(menuElement);

  const [left, right] = appendRadioItems(menuElement, ['Left', 'Right']);

  const menu = new Menu(menuElement);

  await annotate('first item in each group is checked by default');
  await expect.element(top).toHaveAttribute('aria-checked', 'true');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'false');
  await expect.element(left).toHaveAttribute('aria-checked', 'true');
  await expect.element(right).toHaveAttribute('aria-checked', 'false');

  await annotate('navigate to bottom and select it');
  bottom.focus();
  await fireKey(menuElement, ' ');

  await annotate('group 1: bottom checked, top unchecked');
  await expect.element(top).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'true');

  await annotate('group 2: left still checked (unaffected)');
  await expect.element(left).toHaveAttribute('aria-checked', 'true');
  await expect.element(right).toHaveAttribute('aria-checked', 'false');

  menu.dispose();
});

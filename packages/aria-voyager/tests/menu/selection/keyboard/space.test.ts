import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Menu } from '#src';
import { appendRadioItems, appendSeparator, createMenuElement } from '#tests/components/menu';

import { fireKey } from '#tests/test-support/events';

test('Use `Space` on menuitemradio checks it and unchecks siblings in same group', async ({
  annotate
}) => {
  const menuElement = createMenuElement(document.body);

  const [top, bottom] = appendRadioItems(menuElement, ['Top', 'Bottom']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('first radio item is checked by default');
  await expect.element(top).toHaveAttribute('aria-checked', 'true');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'false');

  await annotate('focus second radio item and press Space');
  bottom.focus();
  await fireKey(menuElement, ' ');

  await expect.element(top).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'true');

  await annotate('emitter should be called with all selected items');
  expect(listeners.select).toHaveBeenCalledWith([bottom]);

  menu.dispose();
});

test('Use `Space` does not affect radio items in other groups', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  const [top, bottom] = appendRadioItems(menuElement, ['Top', 'Bottom']);

  appendSeparator(menuElement);

  const [left, right] = appendRadioItems(menuElement, ['Left', 'Right']);

  const menu = new Menu(menuElement);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

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

  await annotate('emitter should be called with all selected items across groups');
  expect(listeners.select).toHaveBeenCalledWith([bottom, left]);

  menu.dispose();
});

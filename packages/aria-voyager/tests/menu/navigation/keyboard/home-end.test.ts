import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigates with `Home` and `End`', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem } = getItems(menu);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await expect.element(lastItem).toHaveAttribute('tabindex', '-1');
  expect(menu.activeItem).toBeUndefined();

  await annotate('focusing activates the first item');
  firstItem.focus();
  expect(menu.activeItem).toBe(firstItem);

  await annotate('activates the last item with END');
  await fireKey(codeMenu, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('activates the first item with HOME');
  await fireKey(codeMenu, 'Home');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('Navigates with `Home` and `End`, skip disabled items', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, lastItem, secondLastItem } = getItems(menu);

  firstItem.setAttribute('aria-disabled', 'true');
  lastItem.setAttribute('aria-disabled', 'true');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await expect.element(lastItem).toHaveAttribute('tabindex', '-1');

  expect(menu.activeItem).toBeUndefined();

  await annotate('focusing activates the second item');
  secondItem.focus();

  expect(menu.activeItem).toBe(secondItem);

  await annotate('activates the second last item with END');
  await fireKey(codeMenu, 'End');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items) {
    if (item !== secondLastItem) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  }

  await annotate('activates the second item with HOME');
  await fireKey(codeMenu, 'Home');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items) {
    if (item !== secondItem) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  }
});

import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowDown`', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, lastItem } = getItems(menu);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(codeMenu, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key to activate third item');
  await fireKey(codeMenu, 'ArrowDown');

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key at the last item does nothing');
  await fireKey(codeMenu, 'End');
  await fireKey(codeMenu, 'ArrowDown');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowDown`, skipping disabled items', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, fourthItem } = getItems(menu);

  thirdItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(codeMenu, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key to activate fourth item');
  await fireKey(codeMenu, 'ArrowDown');

  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== 3)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

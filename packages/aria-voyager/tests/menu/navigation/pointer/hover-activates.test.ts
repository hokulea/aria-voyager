import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Hover activates item', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem } = getItems(menu);

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(menu.activeItem).toBeFalsy();

  await annotate('hovers first item to make it active');
  await userEvent.hover(firstItem);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  expect(menu.activeItem).toBe(firstItem);

  await annotate('hovers second item to make it active');
  await userEvent.hover(secondItem);

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  expect(menu.activeItem).toBe(secondItem);

  for (const item of menu.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

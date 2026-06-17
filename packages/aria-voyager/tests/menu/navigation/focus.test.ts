import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('When Focus', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(menu.activeItem).toBeUndefined();

  await annotate('focus activates the first item');
  codeMenu.dispatchEvent(new FocusEvent('focusin'));

  expect(menu.activeItem).toBe(firstItem);
});

import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { fireHover } from '#tests/test-support/events';

test('Hover opens submenu', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  expect(menu.activeItem).toBeUndefined();

  await annotate('hover item to show submenu');
  await fireHover(fourthItem);

  await expect.element(fourthItem).toHaveFocus();
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
});

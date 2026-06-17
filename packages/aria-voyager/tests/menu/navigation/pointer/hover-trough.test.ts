import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Hover through items opens and closes submenus', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { thirdItem, fourthItem, fifthItem } = getItems(menu);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  await annotate('hover third item');
  thirdItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.element(thirdItem).toHaveFocus();
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  await annotate('hover forth item opens its submenu');
  fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.element(fourthItem).toHaveFocus();
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);

  await annotate('hover fifth item closes previous submenu');
  fifthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.element(fifthItem).toHaveFocus();
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
});

import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { firePointer } from '#tests/test-support/events';

test('Invoking a submenu item closes all submenus', async ({ annotate }) => {
  const { codeMenu, shareMenu, socialMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const social = new Menu(socialMenu);
  const { fourthItem } = getItems(menu);
  const { secondItem: shareSecondItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(false);

  await annotate('open the sub-submenu');
  fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(true);

  await annotate('clicking a menu item closes all submenus');
  await firePointer(social.items[1]);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(false);
});

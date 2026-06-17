import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenuWithTriggerButton, getItems } from '#tests/menu/-shared';

test('Invoking a menu item closes all submenus', async ({ annotate }) => {
  const { codeMenu, shareMenu, socialMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const social = new Menu(socialMenu);
  const { fourthItem } = getItems(menu);
  const { secondItem: shareSecondItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
  await expect.poll(() => socialMenu.matches(':popover-open')).toBeFalsy();

  await annotate('open the menus');
  await userEvent.click(triggerButton);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(true);

  await annotate('use `Enter` on a menu item closes all submenus');
  await userEvent.hover(social.items[1]);
  await userEvent.keyboard('{Enter}');

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(false);
});

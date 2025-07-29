import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenuWithTriggerButton, getItems } from '../../-shared';

describe('Invoking a menu item closes all submenus', () => {
  const { codeMenu, shareMenu, socialMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const socialItem = share.items[1];
  const social = new Menu(socialMenu);
  const mastodonItem = social.items[1];

  test('start', async () => {
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeFalsy();
  });

  test('open the menus', async () => {
    await userEvent.click(triggerButton);

    await vi.waitFor(async () => {
      await expect.poll(() => codeMenu.matches(':popover-open')).toBeTruthy();
    });

    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(fourthItem);
    // await userEvent.hover(socialItem);

    fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    socialItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.poll(() => shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeTruthy();
  });

  test('use `Enter` on a menu item closes all submenus', async () => {
    await userEvent.hover(mastodonItem);
    await userEvent.keyboard('{Enter}');

    await expect.poll(() => codeMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeFalsy();
  });
});

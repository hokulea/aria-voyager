import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Invoking a menu item closes all submenus', () => {
  const { codeMenu, shareMenu, socialMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const socialItem = share.items[1];
  const social = new Menu(socialMenu);
  const mastodonItem = social.items[1];

  test('start', async () => {
    await expect.element(shareMenu).not.toBeVisible();
    await expect.element(socialMenu).not.toBeVisible();
  });

  test('open submenus', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(fourthItem);
    // await userEvent.hover(socialItem);

    fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    socialItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(shareMenu).toBeVisible();
    await expect.element(socialMenu).toBeVisible();
  });

  test('use `Enter` on a menu item closes all submenus', async () => {
    await userEvent.hover(mastodonItem);
    await userEvent.keyboard('{Enter}');

    await expect.element(shareMenu).not.toBeVisible();
    await expect.element(socialMenu).not.toBeVisible();
  });
});

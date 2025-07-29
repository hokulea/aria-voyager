import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenuWithTriggerButton, getItems } from '../../-shared';

describe('Invoking a menu item closes the menu', () => {
  const { codeMenu, shareMenu, socialMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const socialItem = share.items[1];
  const social = new Menu(socialMenu);
  const mastodonItem = social.items[1];

  test('start', async () => {
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeFalsy();
  }));

  test('open the menus', async () => {
    await userEvent.click(triggerButton);
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeTruthy();

    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(fourthItem);
    // await userEvent.hover(socialItem);

    fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    socialItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.poll(() => shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeTruthy();
  });

  test('clicking a menu item closes the menu', async () => {
    await userEvent.click(mastodonItem);

    await expect.poll(() => codeMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => socialMenu.matches(':popover-open')).toBeFalsy();
  });
});

describe('Invoking a descending menu item closes the menu', () => {
  const { codeMenu, refactorHeader, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { secondItem } = getItems(menu);

  test('start', async () => {
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeFalsy();
  }));

  test('open the menus', async () => {
    await userEvent.click(triggerButton);
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeTruthy();
  });

  test('clicking a non-menu item keeps the menu open', async () => {
    await userEvent.click(refactorHeader);
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeTruthy();
  });

  test('clicking a descendend menu item closes the menu', async () => {
    await userEvent.click(secondItem);
    await expect.poll(() => codeMenu.matches(':popover-open')).toBeFalsy();
  });
});

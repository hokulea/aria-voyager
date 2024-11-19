import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

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

  expect(shareMenu.matches(':popover-open')).toBeFalsy();
  expect(socialMenu.matches(':popover-open')).toBeFalsy();

  test('open the menus', async () => {
    await userEvent.click(triggerButton);
    expect(codeMenu.matches(':popover-open')).toBeTruthy();

    await userEvent.hover(fourthItem);
    await userEvent.hover(socialItem);

    expect(shareMenu.matches(':popover-open')).toBeTruthy();
    expect(socialMenu.matches(':popover-open')).toBeTruthy();
  });

  test('use `Enter` on a menu item closes all submenus', async () => {
    await userEvent.hover(mastodonItem);
    await userEvent.keyboard('{Enter}');

    expect(codeMenu.matches(':popover-open')).toBeFalsy();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(socialMenu.matches(':popover-open')).toBeFalsy();
  });
});

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

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(socialMenu.matches(':popover-open')).toBeFalsy();
  });

  test('open the sub-submenu', async () => {
    await userEvent.hover(fourthItem);
    await userEvent.hover(socialItem);

    expect(shareMenu.matches(':popover-open')).toBeTruthy();
    expect(socialMenu.matches(':popover-open')).toBeTruthy();
  });

  test('clicking a menu item closes all submenus', async () => {
    await userEvent.click(mastodonItem);

    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(socialMenu.matches(':popover-open')).toBeFalsy();
  });
});

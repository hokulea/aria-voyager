import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Hover through items opens and closes submenus', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { thirdItem, fourthItem, fifthItem } = getItems(menu);

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('hover third item', async () => {
    await userEvent.hover(thirdItem);

    await expect.element(thirdItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('hover forth item opens its submenu', async () => {
    await userEvent.hover(fourthItem);

    await expect.element(fourthItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeTruthy();
  });

  test('hover fifth item closes previous submenu', async () => {
    await userEvent.hover(fifthItem);

    await expect.element(fifthItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Hover opens submenu', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(menu.activeItem).toBeUndefined();
  });

  test('hover item to show submenu', async () => {
    await userEvent.hover(fourthItem);

    await expect.element(fourthItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeTruthy();
  });
});

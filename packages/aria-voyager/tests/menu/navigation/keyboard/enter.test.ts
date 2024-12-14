import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Open with `Enter`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    firstItem.focus();
  });

  test('use `Enter` to open submenu', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    expect(fourthItem.getAttribute('tabindex')).toBe('0');

    await userEvent.keyboard('{Enter}');
    expect(shareMenu.matches(':popover-open')).toBeTruthy();
    expect(codeItem.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(codeItem);
  });
});

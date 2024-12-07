import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Close with `ArrowLeft`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];
  const { fourthItem } = getItems(menu);

  test('open share menu', async () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();

    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    expect(codeItem.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(codeItem);
  });

  test('use `ArrowLeft` to close submenu', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('has focus moved to the trigger of the submenu', () => {
    expect(document.activeElement).toBe(fourthItem);
  });
});

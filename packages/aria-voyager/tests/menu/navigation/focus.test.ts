import { describe, expect, test } from 'vitest';

import { Menu } from '../../../src';
import { createCodeMenu, getItems } from '../-shared';

describe('When Focus', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    expect(menu.activeItem).toBeUndefined();
  });

  test('focus activates the first item', () => {
    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    expect(menu.activeItem).toBe(firstItem);
  });
});

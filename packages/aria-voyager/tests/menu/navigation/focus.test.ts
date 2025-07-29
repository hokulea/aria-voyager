import { describe, expect, test } from 'vitest';

import { Menu } from '../../../src';
import { createCodeMenu, getItems } from '../-shared';

describe('When Focus', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    
    for (const item of menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(menu.activeItem).toBeUndefined();
  });

  test('focus activates the first item', () => {
    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    expect(menu.activeItem).toBe(firstItem);
  });
});

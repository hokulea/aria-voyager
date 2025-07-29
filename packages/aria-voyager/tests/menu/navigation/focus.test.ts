import { describe, expect, test } from 'vitest';

import { Menu } from '../../../src';
import { createCodeMenu, getItems } from '../-shared';

describe('When Focus', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() => menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();

    await expect.poll(() => menu.activeItem).toBeUndefined();
  });

  test('focus activates the first item', async () => {
    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    await expect.poll(() => menu.activeItem).toBe(firstItem);
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Hover activates item', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem } = getItems(menu);

  test('start', () => {
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    expect(menu.activeItem).toBeFalsy();
  });

  test('hovers first item to make it active', async () => {
    await userEvent.hover(firstItem);

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    expect(menu.activeItem).toBe(firstItem);
  });

  test('hovers second item to make it active', async () => {
    await userEvent.hover(secondItem);

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    expect(menu.activeItem).toBe(secondItem);
    expect(
      menu.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

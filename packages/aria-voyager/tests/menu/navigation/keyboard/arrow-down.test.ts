import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigate with `ArrowDown`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    codeMenu.dispatchEvent(new FocusEvent('focusin'));
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(thirdItem.getAttribute('tabindex')).toBe('0');

    expect(
      menu.items
        .filter((_, idx) => idx !== 2)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

describe('navigate with `ArrowDown`, skipping disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, fourthItem } = getItems(menu);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    codeMenu.dispatchEvent(new FocusEvent('focusin'));
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(fourthItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== 3)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

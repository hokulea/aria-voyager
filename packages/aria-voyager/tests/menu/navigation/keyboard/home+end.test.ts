import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigates with `Home` and `End`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem } = getItems(menu);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(lastItem.getAttribute('tabindex')).toBe('-1');
    expect(menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', () => {
    firstItem.focus();
    expect(menu.activeItem).toBe(firstItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

describe('Navigates with `Home` and `End`, skip disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, secondLastItem, lastItem } = getItems(menu);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(lastItem.getAttribute('tabindex')).toBe('-1');

    firstItem.setAttribute('aria-disabled', 'true');
    lastItem.setAttribute('aria-disabled', 'true');

    expect(menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', () => {
    secondItem.focus();

    expect(menu.activeItem).toBe(secondItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    expect(secondLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

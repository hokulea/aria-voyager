import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigate with `ArrowUp`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    firstItem.focus();
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(secondLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(thirdLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== menu.items.indexOf(thirdLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

describe('navigate with `ArrowUp`, skip disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    firstItem.focus();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(secondLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(fourthLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items
        .filter((_, idx) => idx !== menu.items.indexOf(fourthLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

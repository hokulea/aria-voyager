import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigates with `Home` and `End`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('tabindex', '0');
    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('tabindex', '-1');
    await expect.poll(() => menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', async () => {
    firstItem.focus();
    await expect.poll(() => menu.activeItem).toBe(firstItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() => menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() => menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });
});

describe('Navigates with `Home` and `End`, skip disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, secondLastItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('tabindex', '0');
    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('tabindex', '-1');

    firstItem.setAttribute('aria-disabled', 'true');
    lastItem.setAttribute('aria-disabled', 'true');

    await expect.poll(() => menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', async () => {
    secondItem.focus();

    await expect.poll(() => menu.activeItem).toBe(secondItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(secondLastItem)).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() =>
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() =>
        menu.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });
});

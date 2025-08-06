import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigates with `Home` and `End`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    await expect.element(lastItem).toHaveAttribute('tabindex', '-1');
    expect(menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', () => {
    firstItem.focus();
    expect(menu.activeItem).toBe(firstItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('Navigates with `Home` and `End`, skip disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, secondLastItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    await expect.element(lastItem).toHaveAttribute('tabindex', '-1');

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

    await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items) {
      if (item !== secondLastItem) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    }
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items) {
      if (item !== secondItem) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    }
  });
});

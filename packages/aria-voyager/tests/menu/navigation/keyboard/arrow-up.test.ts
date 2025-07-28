import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

describe('Navigate with `ArrowUp`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    firstItem.focus();
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(thirdLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowUp`, skip disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    firstItem.focus();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

    for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(fourthLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

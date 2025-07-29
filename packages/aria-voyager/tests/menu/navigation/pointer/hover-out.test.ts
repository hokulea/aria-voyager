import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Hover out to trigger keeps submenu open', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];
  const { fourthItem } = getItems(menu);

  await expect.element(shareMenu).not.toBeVisible();

  test('hover item to show submenu', async () => {
    await userEvent.hover(fourthItem);

    await expect.element(shareMenu).toBeVisible();
  });

  test('hover into submenu moves focus', async () => {
    await userEvent.hover(codeItem);

    await expect.element(shareMenu).toBeVisible();
  });

  test('hover back to trigger moves focus and keeps the submenu open', async () => {
    shareMenu.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: fourthItem })
    );

    await vi.waitFor(() => {
      await expect.element(shareMenu).toBeVisible();
      await expect.element(fourthItem).toHaveFocus();
    });
  });
});

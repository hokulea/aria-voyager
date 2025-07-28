import { describe, expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

describe('Hover through items opens and closes submenus', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { thirdItem, fourthItem, fifthItem } = getItems(menu);

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('hover third item', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(thirdItem);

    thirdItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(thirdItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('hover forth item opens its submenu', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(fourthItem);

    fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(fourthItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeTruthy();
  });

  test('hover fifth item closes previous submenu', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(fifthItem);

    fifthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(fifthItem).toHaveFocus();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
  });
});

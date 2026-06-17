import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Open with `Enter`', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const { firstItem: shareFirstItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();

  await annotate('use `Enter` to open submenu');
  firstItem.focus();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

  await userEvent.keyboard('{Enter}');
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.element(shareFirstItem).toHaveAttribute('tabindex', '0');
  expect(document.activeElement).toBe(shareFirstItem);
});

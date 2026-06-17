import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { fireKey } from '#tests/test-support/events';

test('Open with `Enter`', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const { firstItem: shareFirstItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();

  await annotate('use `Enter` to open submenu');
  firstItem.focus();
  await fireKey(codeMenu, 'ArrowDown');
  await fireKey(codeMenu, 'ArrowDown');
  await fireKey(codeMenu, 'ArrowDown');
  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

  await fireKey(codeMenu, 'Enter');
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.element(shareFirstItem).toHaveAttribute('tabindex', '0');
  await expect.poll(() => document.activeElement).toBe(shareFirstItem);
});

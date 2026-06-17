import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

import { fireKey } from '#tests/test-support/events';

test('Close with `Escape`', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const { firstItem: shareFirstItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  firstItem.focus();

  await fireKey(codeMenu, 'ArrowDown');
  await fireKey(codeMenu, 'ArrowDown');
  await fireKey(codeMenu, 'ArrowDown');
  await fireKey(codeMenu, 'ArrowRight');

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.element(shareFirstItem).toHaveAttribute('tabindex', '0');
  await expect.poll(() => document.activeElement).toBe(shareFirstItem);

  await annotate('use `Escape` to close submenu');
  await fireKey(shareMenu, 'Escape');

  shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => document.activeElement).toBe(fourthItem);
});

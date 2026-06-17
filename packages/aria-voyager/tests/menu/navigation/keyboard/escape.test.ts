import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Close with `Escape`', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const { firstItem: shareFirstItem } = getItems(share);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  firstItem.focus();

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowRight}');

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.element(shareFirstItem).toHaveAttribute('tabindex', '0');
  expect(document.activeElement).toBe(shareFirstItem);

  await annotate('use `Escape` to close submenu');
  await userEvent.keyboard('{Escape}');

  shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  expect(document.activeElement).toBe(fourthItem);
});

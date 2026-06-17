import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Hover out to trigger keeps submenu open', async ({ annotate }) => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const { fourthItem } = getItems(menu);
  const { firstItem: shareFirstItem } = getItems(share);

  await annotate('hover item to show submenu');
  await userEvent.hover(fourthItem);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);

  await annotate('hover into submenu moves focus');
  await userEvent.hover(shareFirstItem);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);

  await annotate('hover back to trigger moves focus and keeps the submenu open');
  shareMenu.dispatchEvent(
    new PointerEvent('pointerout', { bubbles: true, relatedTarget: fourthItem })
  );

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await expect.poll(() => expect.element(fourthItem).toHaveFocus());
});

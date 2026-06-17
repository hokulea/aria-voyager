import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenuWithTriggerButton, getItems } from '#tests/menu/-shared';

import { firePointer } from '#tests/test-support/events';

test('Invoking a menu item closes the menu', async ({ annotate }) => {
  const { codeMenu, shareMenu, socialMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const social = new Menu(socialMenu);
  const { fourthItem } = getItems(menu);
  const { secondItem: shareSecondItem } = getItems(share);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(false);

  await annotate('open the menus');
  triggerButton.click();
  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(true);

  await annotate('clicking a menu item closes the menu');
  await firePointer(social.items[1]);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
  await expect.poll(() => socialMenu.matches(':popover-open')).toBe(false);
});

test('Invoking a descending menu item closes the menu', async ({ annotate }) => {
  const { codeMenu, triggerButton, refactorHeader } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { secondItem } = getItems(menu);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(false);

  await annotate('open the menu');
  triggerButton.click();
  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('clicking a non-menu item keeps the menu open');
  await firePointer(refactorHeader);
  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('clicking a descendend menu item closes the menu');
  await firePointer(secondItem);
  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(false);
});

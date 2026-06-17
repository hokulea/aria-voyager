import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenuWithTriggerButton, getItems } from '#tests/menu/-shared';

import { fireHover } from '#tests/test-support/events';

test('Pointer leaving menu clears active item', async ({ annotate }) => {
  const { codeMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem } = getItems(menu);

  triggerButton.click();

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('hover item to make it active');
  await fireHover(secondItem);

  expect(menu.activeItem).toBe(secondItem);
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  await annotate('pointer leaving menu clears active item');
  codeMenu.dispatchEvent(
    new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body })
  );

  expect(menu.activeItem).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await expect.element(secondItem).toHaveAttribute('tabindex', '-1');
});

test('Pointer leaving menu closes open submenus', async ({ annotate }) => {
  const { codeMenu, shareMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { fourthItem } = getItems(menu);

  triggerButton.click();

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  await annotate('hover share item to open submenu');
  await fireHover(fourthItem);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(true);

  await annotate('pointer leaving menu closes submenu');
  codeMenu.dispatchEvent(
    new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body })
  );

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);
});

test('Clicking menu item works after hover', async ({ annotate }) => {
  const { codeMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);
  let clicked = false;

  firstItem.addEventListener('click', () => {
    clicked = true;
  });

  triggerButton.click();

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('hover and click item fires click handler');
  await fireHover(firstItem);

  expect(menu.activeItem).toBe(firstItem);

  firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  firstItem.click();

  expect(clicked).toBe(true);
});

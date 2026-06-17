import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenuWithTriggerButton, getItems } from '#tests/menu/-shared';

test('Pointer leaving menu clears active item', async ({ annotate }) => {
  const { codeMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem } = getItems(menu);

  await userEvent.click(triggerButton);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('hover item to make it active');
  await userEvent.hover(secondItem);

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

  await userEvent.click(triggerButton);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await expect.poll(() => shareMenu.matches(':popover-open')).toBe(false);

  await annotate('hover share item to open submenu');
  await userEvent.hover(fourthItem);

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

  await userEvent.click(triggerButton);

  await expect.poll(() => codeMenu.matches(':popover-open')).toBe(true);

  await annotate('hover and click item fires click handler');
  await userEvent.hover(firstItem);

  expect(menu.activeItem).toBe(firstItem);

  await userEvent.click(firstItem);

  expect(clicked).toBe(true);
});

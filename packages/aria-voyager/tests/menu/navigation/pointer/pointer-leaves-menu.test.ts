import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '#src';
import { createCodeMenuWithTriggerButton, getItems } from '#tests/menu/-shared';

describe('Pointer leaving menu clears active item', () => {
  const { codeMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem } = getItems(menu);

  test('open the menu', async () => {
    await userEvent.click(triggerButton);

    expect(codeMenu.matches(':popover-open')).toBeTruthy();
  });

  test('hover item to make it active', async () => {
    await userEvent.hover(secondItem);

    expect(menu.activeItem).toBe(secondItem);
    await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  });

  test('pointer leaves menu clears active item', async () => {
    // Simulate pointer leaving the menu (moving to document body)
    codeMenu.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body })
    );

    // Active item should be cleared
    expect(menu.activeItem).toBeUndefined();

    // First item should have tabindex="0" for keyboard access
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    // Previously active item should have tabindex="-1"
    await expect.element(secondItem).toHaveAttribute('tabindex', '-1');
  });
});

describe('Clicking menu item works after hover', () => {
  const { codeMenu, triggerButton } = createCodeMenuWithTriggerButton();
  const menu = new Menu(codeMenu);
  const { firstItem } = getItems(menu);
  let clicked = false;

  firstItem.addEventListener('click', () => {
    clicked = true;
  });

  test('open the menu', async () => {
    await userEvent.click(triggerButton);

    expect(codeMenu.matches(':popover-open')).toBeTruthy();
  });

  test('hover and click item fires click handler', async () => {
    await userEvent.hover(firstItem);

    expect(menu.activeItem).toBe(firstItem);

    await userEvent.click(firstItem);

    expect(clicked).toBe(true);
  });
});

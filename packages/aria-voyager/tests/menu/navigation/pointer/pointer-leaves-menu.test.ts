import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Pointer leaving menu clears active item', () => {
  const ctx = setupCodeMenu({ withTrigger: true });

  test('open the menu', async () => {
    await userEvent.click(ctx.triggerButton);

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);
  });

  test('hover item to make it active', async () => {
    await userEvent.hover(ctx.secondItem);

    expect(ctx.menu.activeItem).toBe(ctx.secondItem);
    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');
  });

  test('pointer leaving menu clears active item', async () => {
    // Simulate pointer leaving the menu (moving to document body)
    ctx.codeMenu.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body })
    );

    // Active item should be first item
    expect(ctx.menu.activeItem).toBe(ctx.firstItem);

    // First item should have tabindex="0" for keyboard access
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    // Previously active item should have tabindex="-1"
    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '-1');
  });
});

describe('Pointer leaving menu closes open submenus', () => {
  const ctx = setupCodeMenu({ withTrigger: true });

  test('open the menu', async () => {
    await userEvent.click(ctx.triggerButton);

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);
  });

  test('share menu is closed', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });

  test('hover share menuitom to open submenu', async () => {
    await userEvent.hover(ctx.fourthItem);

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
  });

  test('pointer leaving menu closes submenu', async () => {
    // Simulate pointer leaving the menu (moving to document body)
    ctx.codeMenu.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body })
    );

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });
});

describe('Clicking menu item works after hover', () => {
  const ctx = setupCodeMenu({ withTrigger: true });
  let clicked = false;

  beforeAll(() => {
    ctx.firstItem.addEventListener('click', () => {
      clicked = true;
    });
  });

  test('open the menu', async () => {
    await userEvent.click(ctx.triggerButton);

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);
  });

  test('hover and click item fires click handler', async () => {
    await userEvent.hover(ctx.firstItem);

    expect(ctx.menu.activeItem).toBe(ctx.firstItem);

    await userEvent.click(ctx.firstItem);

    expect(clicked).toBe(true);
  });
});

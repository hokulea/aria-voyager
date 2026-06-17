import { describe, expect, test } from 'vitest';
import { Menu } from '#src';
import { createMenuElement } from '#tests/components/menu';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('renders', () => {
  const ctx = setupCodeMenu();

  test('renders', () => {
    expect(ctx.menu.items.length).toBe(15);
  });
});

describe('setup', () => {
  const ctx = setupCodeMenu();

  test('has menu role', async () => {
    const menu = createMenuElement(document.body);

    new Menu(menu);

    await expect.element(menu).toHaveAttribute('role', 'menu');
  });

  test('sets tabindex on the first item', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');
  });

  test('reads items', () => {
    expect(ctx.menu.items.length).toBe(15);
  });

  test('items have tabindex', async () => {
    for (const item of ctx.menu.items) {
      await expect.element(item).toHaveAttribute('tabindex');
    }
  });
});

describe('disabled', () => {
  const ctx = setupCodeMenu({ disabled: true });

  test('focus does not work', async () => {
    for (const item of ctx.menu.items) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

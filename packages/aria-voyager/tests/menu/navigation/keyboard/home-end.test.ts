import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Navigates with `Home` and `End`', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');
    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '-1');
    expect(ctx.menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', () => {
    ctx.firstItem.focus();
    expect(ctx.menu.activeItem).toBe(ctx.firstItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('Navigates with `Home` and `End`, skip disabled items', () => {
  const ctx = setupCodeMenu();

  beforeAll(() => {
    ctx.firstItem.setAttribute('aria-disabled', 'true');
    ctx.lastItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');
    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '-1');

    expect(ctx.menu.activeItem).toBeUndefined();
  });

  test('focusing activates the first item', () => {
    ctx.secondItem.focus();

    expect(ctx.menu.activeItem).toBe(ctx.secondItem);
  });

  test('activates the last item with END', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items) {
      if (item !== ctx.secondLastItem) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    }
  });

  test('activates the first item with HOME', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items) {
      if (item !== ctx.secondItem) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    }
  });
});

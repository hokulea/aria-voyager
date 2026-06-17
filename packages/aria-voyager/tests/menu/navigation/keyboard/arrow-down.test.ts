import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Navigate with `ArrowDown`', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.thirdItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowDown`, skipping disabled items', () => {
  const ctx = setupCodeMenu();

  beforeAll(() => {
    ctx.thirdItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.fourthItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

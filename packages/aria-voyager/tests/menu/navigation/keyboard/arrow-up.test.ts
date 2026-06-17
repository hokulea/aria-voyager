import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Navigate with `ArrowUp`', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    ctx.firstItem.focus();
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== ctx.menu.items.indexOf(ctx.secondLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.thirdLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== ctx.menu.items.indexOf(ctx.thirdLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowUp`, skip disabled items', () => {
  const ctx = setupCodeMenu();

  beforeAll(() => {
    ctx.thirdLastItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    ctx.firstItem.focus();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== ctx.menu.items.indexOf(ctx.secondLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.fourthLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.filter((_, idx) => idx !== ctx.menu.items.indexOf(ctx.fourthLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

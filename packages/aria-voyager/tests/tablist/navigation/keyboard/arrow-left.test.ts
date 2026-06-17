import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Navigate with `ArrowLeft`', () => {
  const ctx = setupTabs();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(ctx.tabs.activeItem).toBeTruthy();

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter(
      (_, idx) => idx !== ctx.tabs.items.indexOf(ctx.secondLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(ctx.thirdLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter(
      (_, idx) => idx !== ctx.tabs.items.indexOf(ctx.thirdLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowLeft`, skipping disabled items', () => {
  const ctx = setupTabs();

  beforeAll(() => {
    ctx.thirdLastItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(ctx.tabs.activeItem).toBeTruthy();

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter(
      (_, idx) => idx !== ctx.tabs.items.indexOf(ctx.secondLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(ctx.fourthLastItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter(
      (_, idx) => idx !== ctx.tabs.items.indexOf(ctx.fourthLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

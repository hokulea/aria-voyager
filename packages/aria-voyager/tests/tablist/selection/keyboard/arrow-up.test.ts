import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Select with `ArrowUp`', () => {
  const ctx = setupTabs();

  beforeAll(() => {
    ctx.tablist.setAttribute('aria-orientation', 'vertical');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== ctx.tabs.items.indexOf(ctx.secondLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.thirdLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== ctx.tabs.items.indexOf(ctx.thirdLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

describe('select with `ArrowUp`, skipping disabled items', () => {
  const ctx = setupTabs();

  beforeAll(() => {
    ctx.tablist.setAttribute('aria-orientation', 'vertical');
    ctx.thirdLastItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(ctx.tabs.activeItem).toBeTruthy();

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(ctx.lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.secondLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== ctx.tabs.items.indexOf(ctx.secondLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.fourthLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== ctx.tabs.items.indexOf(ctx.fourthLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

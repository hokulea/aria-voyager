import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Select with `ArrowDown`', () => {
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

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

describe('select with `ArrowDown`, skipping disabled items', () => {
  const ctx = setupTabs();

  beforeAll(() => {
    ctx.tablist.setAttribute('aria-orientation', 'vertical');
    ctx.thirdItem.setAttribute('aria-disabled', 'true');
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

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

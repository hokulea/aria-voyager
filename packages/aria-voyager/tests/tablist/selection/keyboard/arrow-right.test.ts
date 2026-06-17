import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Select with `ArrowRight`', () => {
  const ctx = setupTabs();

  test('focus in', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
    }
  });

  test('use `ArrowRight` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowRight` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(ctx.lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

describe('select with `ArrowRight`, skipping disabled items', () => {
  const ctx = setupTabs();

  beforeAll(() => {
    ctx.thirdItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(ctx.fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

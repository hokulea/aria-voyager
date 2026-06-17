import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Use pointer to select items', () => {
  const ctx = setupTabs();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  // seems like, when clicking the tablist with playwright, then it also clicks
  // the last button in there. This behavior is different, than in a browser
  test.skip('select not an item does nothing', async () => {
    await userEvent.click(ctx.tablist);
    expect(ctx.tabs.activeItem).toBeTruthy();

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('select second item', async () => {
    await userEvent.click(ctx.secondItem);

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('select third item', async () => {
    await userEvent.click(ctx.thirdItem);

    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

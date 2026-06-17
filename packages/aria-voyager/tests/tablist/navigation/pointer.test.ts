import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Use pointer to activate items', () => {
  const ctx = setupTabs();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(ctx.tabs.activeItem).toBeTruthy();
  });

  // does not run in CLI mode
  // update vitest and activate again
  test.skip('select not an item does nothing', async () => {
    await userEvent.click(ctx.tablist);

    expect(ctx.tabs.activeItem).toBeTruthy();

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('select second item', async () => {
    await userEvent.click(ctx.secondItem);

    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('select third item', async () => {
    await userEvent.click(ctx.thirdItem);

    await expect.element(ctx.thirdItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

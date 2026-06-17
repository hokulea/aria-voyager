import { describe, expect, test } from 'vitest';

import { Tablist } from '#src';
import { setupTabs } from '#tests/tablist/-shared';

describe('renders', () => {
  const ctx = setupTabs();

  test('has 5 items', () => {
    expect(ctx.tabs.items.length).toBe(5);
  });
});

describe('setup', () => {
  const ctx = setupTabs();

  test('has menu role', async () => {
    await expect.element(ctx.tablist).toHaveAttribute('role', 'tablist');
  });

  test('sets tabindex on the first item', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');
  });

  test('items have tabindex', async () => {
    for (const item of ctx.tabs.items) {
      await expect.element(item).toHaveAttribute('tabindex');
    }
  });
});

describe('disabled', () => {
  const ctx = setupTabs();

  test('focus does not work', async () => {
    ctx.tablist.setAttribute('aria-disabled', 'true');

    const tabs = new Tablist(ctx.tablist);

    for (const item of tabs.items) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

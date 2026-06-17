import { describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { appendTab, getItems } from '#tests/components/tabs';
import { setupTabs } from '#tests/tablist/-shared';

describe('DOM Observer', () => {
  const ctx = setupTabs();

  test('reads elements on appending', async () => {
    appendTab(ctx.container, 'Grapefruit', 'For summer');

    await vi.waitUntil(() => getItems(ctx.tablist).length === 6);

    expect(ctx.tabs.items.length).toBe(6);
  });

  test('reads selection on external update', async () => {
    expect(ctx.tabs.selection[0]).toBe(ctx.firstItem);

    ctx.firstItem.removeAttribute('aria-selected');
    ctx.secondItem.setAttribute('aria-selected', 'true');

    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    expect(ctx.tabs.selection[0]).toBe(ctx.secondItem);
  });

  test('removes items that contain selection', async () => {
    expect(ctx.tabs.selection.length).toBe(1);
    expect(ctx.tabs.items.length).toBe(6);

    ctx.secondItem.remove();

    await vi.waitUntil(() => getItems(ctx.tablist).length === 5);

    expect(ctx.tabs.items.length).toBe(5);
    expect(ctx.tabs.selection.length).toBe(1);
    expect(ctx.tabs.selection[0]).toBe(ctx.firstItem);
  });

  describe('read options', () => {
    test('detects vertical orientation', async () => {
      expect(ctx.tabs.options.orientation).toBe('horizontal');

      ctx.tablist.setAttribute('aria-orientation', 'vertical');

      await expect.element(ctx.tablist).toHaveAttribute('aria-orientation', 'vertical');

      expect(ctx.tabs.options.orientation).toBe('vertical');
    });

    test('detects horizontal orientation', async () => {
      expect(ctx.tabs.options.orientation).toBe('vertical');

      ctx.tablist.removeAttribute('aria-orientation');

      await expect.element(ctx.tablist).not.toHaveAttribute('aria-orientation');

      expect(ctx.tabs.options.orientation).toBe('horizontal');
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await userEvent.click(ctx.firstItem);

      await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

      ctx.tablist.setAttribute('aria-disabled', 'true');

      await expect.element(ctx.tablist).toHaveAttribute('aria-disabled', 'true');

      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.tablist.removeAttribute('aria-disabled');

      await expect.element(ctx.tablist).not.toHaveAttribute('aria-disabled');

      await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

      for (const item of ctx.tabs.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});

import { describe, expect, test, vi } from 'vitest';

import { appendItemToList, getItems } from '#tests/components/list';

import { setupListbox } from '../-shared';

describe('DOM Observer', () => {
  const ctx = setupListbox();

  test('start', () => {
    expect(ctx.listbox.items.length).toBe(3);
  });

  test('reads elements on appending', async () => {
    appendItemToList('Grapefruit', ctx.list);

    await vi.waitUntil(() => getItems(ctx.list).length === 4);

    expect(ctx.listbox.items.length).toBe(4);
  });

  test('reads selection on external update', async () => {
    const secondItem = ctx.listbox.items[1];

    expect(ctx.listbox.selection.length).toBe(0);

    secondItem.setAttribute('aria-selected', 'true');

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    expect(ctx.listbox.selection.length).toBe(1);
  });

  test('removes items that contain selection', async () => {
    expect(ctx.listbox.selection.length).toBe(1);
    expect(ctx.listbox.items.length).toBe(4);

    const secondItem = ctx.list.children[1];

    secondItem.remove();

    await vi.waitUntil(() => getItems(ctx.list).length === 3);

    expect(ctx.listbox.items.length).toBe(3);
    expect(ctx.listbox.selection.length).toBe(0);
  });

  describe('read options', () => {
    test('detects multi-select', async () => {
      expect(ctx.listbox.options.multiple).toBeFalsy();

      ctx.list.setAttribute('aria-multiselectable', 'true');

      await expect.element(ctx.list).toHaveAttribute('aria-multiselectable', 'true');

      expect(ctx.listbox.options.multiple).toBeTruthy();
    });

    test('detects single-select', async () => {
      expect(ctx.listbox.options.multiple).toBeTruthy();

      ctx.list.removeAttribute('aria-multiselectable');

      await expect.element(ctx.list).not.toHaveAttribute('aria-multiselectable');

      expect(ctx.listbox.options.multiple).toBeFalsy();
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await expect.element(ctx.list).toHaveAttribute('tabindex', '0');

      ctx.list.setAttribute('aria-disabled', 'true');

      await expect.element(ctx.list).toHaveAttribute('aria-disabled', 'true');

      await expect.element(ctx.list).toHaveAttribute('tabindex', '-1');
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      await expect.element(ctx.list).toHaveAttribute('tabindex', '-1');

      ctx.list.removeAttribute('aria-disabled');

      await expect.element(ctx.list).not.toHaveAttribute('aria-disabled');

      await expect.element(ctx.list).toHaveAttribute('tabindex', '0');
    });
  });
});

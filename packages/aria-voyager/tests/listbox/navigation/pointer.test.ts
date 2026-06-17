import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../-shared';

describe('use pointer to activate items', () => {
  const ctx = setupListbox();

  test('start', async () => {
    await expect.element(ctx.list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the list activates first item', async () => {
    await userEvent.click(ctx.list);

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the second item activates it', async () => {
    await userEvent.click(ctx.secondItem);

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the third item activates it', async () => {
    await userEvent.click(ctx.thirdItem);

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });
});

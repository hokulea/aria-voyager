import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('Navigate with `ArrowDown`', () => {
  const ctx = setupListbox();

  test('start', async () => {
    await expect.element(ctx.list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', () => {
    ctx.list.focus();
    expect(document.activeElement).toBe(ctx.list);
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowDown` key, but keep third item activated (hit end of list)', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });
});

describe('Navigate with `ArrowDown`, skip disabled item', () => {
  const ctx = setupListbox();

  beforeAll(() => {
    ctx.secondItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', () => {
    ctx.list.focus();
    expect(document.activeElement).toBe(ctx.list);
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });
});

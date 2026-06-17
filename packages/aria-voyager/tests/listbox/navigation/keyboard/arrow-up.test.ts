import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('Navigate with `ArrowUp`', () => {
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

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to, but keep first item activated (hit beginning of list)', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});

describe('Navigate with `ArrowUp`, skip disabled item', () => {
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

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});

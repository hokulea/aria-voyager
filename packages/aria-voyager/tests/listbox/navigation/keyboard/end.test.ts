import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('Navigates with `End`', () => {
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
});

describe('Navigates with `End`, skip disabled item', () => {
  const ctx = setupListbox();

  beforeAll(() => {
    ctx.thirdItem.setAttribute('aria-disabled', 'true');
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

  test('use `End` key to activate second last item', async () => {
    await userEvent.keyboard('{End}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});

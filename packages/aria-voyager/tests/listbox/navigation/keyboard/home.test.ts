import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('navigates with `Home`', () => {
  const ctx = setupListbox();

  test('start', async () => {
    await expect.element(ctx.list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list and activate last item', async () => {
    ctx.list.focus();
    expect(document.activeElement).toBe(ctx.list);
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);

    await userEvent.keyboard('{End}');
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});

describe('navigates with `Home`, skip disabled item', () => {
  const ctx = setupListbox();

  beforeAll(() => {
    ctx.firstItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    await expect.element(ctx.list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list and activate last item', async () => {
    ctx.list.focus();

    expect(document.activeElement).toBe(ctx.list);
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);

    await userEvent.keyboard('{End}');
    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});

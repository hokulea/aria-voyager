import { beforeAll, describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupTabs } from '#tests/tablist/-shared';

describe('Select manually with spacebar`', () => {
  const ctx = setupTabs({
    behavior: {
      singleSelection: 'manual'
    }
  });

  beforeAll(() => {
    ctx.thirdItem.setAttribute('aria-disabled', 'true');
  });

  test('start', async () => {
    expect(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    ctx.firstItem.focus();
    expect(document.activeElement).toBe(ctx.firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(ctx.firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(ctx.fourthItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use spacebar to select fourth item', async () => {
    await userEvent.keyboard('{ }');

    expect(ctx.fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 4)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
    }
  });

  test('use `ArrowLeft` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(ctx.fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 4)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
    }

    expect(ctx.secondItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use spacebar to select second item', async () => {
    await userEvent.keyboard('{ }');

    expect(ctx.secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('Select manually with spacebar`', () => {
  const { tabs } = createTabs({
    behavior: {
      singleSelection: 'manual'
    }
  });
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    expect(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(fourthItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use spacebar to select fourth item', async () => {
    await userEvent.keyboard('{ }');

    expect(fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 4)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
    }
  });

  test('use `ArrowLeft` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 4)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
    }

    expect(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use spacebar to select second item', async () => {
    await userEvent.keyboard('{ }');

    expect(secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

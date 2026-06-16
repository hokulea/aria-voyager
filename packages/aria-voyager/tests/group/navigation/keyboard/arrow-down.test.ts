import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

describe('Navigate with `ArrowDown`', () => {
  const { group } = createButtonGroup();
  const { firstItem, secondItem, thirdItem, lastItem } = getGroupItems(group);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(group.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter((_, idx) => idx !== 2)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).toHaveAttribute('tabindex', '-1'));
    }
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowDown`, skipping disabled items', () => {
  const { group } = createButtonGroup();
  const { firstItem, secondItem, thirdItem, fourthItem } = getGroupItems(group);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(group.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

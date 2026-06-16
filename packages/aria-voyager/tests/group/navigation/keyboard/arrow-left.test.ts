import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

describe('Navigate with `ArrowLeft`', () => {
  const { group } = createButtonGroup();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getGroupItems(group);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(group.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowLeft` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter(
      (_, idx) => idx !== group.items.indexOf(secondLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter((_, idx) => idx !== group.items.indexOf(thirdLastItem))) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowLeft`, skipping disabled items', () => {
  const { group } = createButtonGroup();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } =
    getGroupItems(group);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(group.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter(
      (_, idx) => idx !== group.items.indexOf(secondLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

    for (const item of group.items.filter(
      (_, idx) => idx !== group.items.indexOf(fourthLastItem)
    )) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

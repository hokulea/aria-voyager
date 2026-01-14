import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

describe('use pointer to activate items', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.element(list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the list activates first item', async () => {
    await userEvent.click(list);

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the second item activates it', async () => {
    await userEvent.click(secondItem);

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('clicking the third item activates it', async () => {
    await userEvent.click(thirdItem);

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
  });
});

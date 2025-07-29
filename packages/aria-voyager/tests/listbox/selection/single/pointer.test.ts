import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('With Pointer', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    // await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    // await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    // await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();

    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-selected');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    // await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    // await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    // await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');

    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-selected');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-selected');
    await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-selected', 'true');
  });
});

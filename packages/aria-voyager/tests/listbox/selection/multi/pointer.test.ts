import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../-shared';

describe('Select with Pointer', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start - no items selected', async () => {
    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select third item with `Meta` key', async () => {
    // https://github.com/hokulea/aria-voyager/issues/259
    // const user = userEvent.setup();

    // await user.keyboard('{Meta>}');
    // await user.click(thirdItem);
    // await user.keyboard('{/Meta}');

    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('deselect second item with `Meta` key', async () => {
    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('select third to first item with `Shift` key', async () => {
    firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});

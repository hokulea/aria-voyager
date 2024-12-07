import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../-shared';

describe('Select with Pointer', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  test('select second item', async () => {
    await userEvent.click(secondItem);

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('select third item with `Meta` key', () => {
    // https://github.com/hokulea/aria-voyager/issues/259
    // const user = userEvent.setup();

    // await user.keyboard('{Meta>}');
    // await user.click(thirdItem);
    // await user.keyboard('{/Meta}');

    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  test('deselect second item with `Meta` key', () => {
    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  test('select third to first item with `Shift` key', () => {
    firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});

import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('Select from first to third item with `End` and `Shift` key', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  await userEvent.click(firstItem);

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  await userEvent.keyboard('{Shift>}{End}');

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBe('true');
  expect(thirdItem.getAttribute('aria-selected')).toBe('true');
});

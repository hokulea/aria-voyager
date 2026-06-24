import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { firePointer, focusControl } from '#tests/test-support/events';

test('use pointer to activate items', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the list activates first item');
  await focusControl(list);
  await firePointer(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the second item activates it');
  await focusControl(list);
  await firePointer(secondItem);
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the third item activates it');
  await focusControl(list);
  await firePointer(thirdItem);
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

test('clicking a disabled item does not activate it', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  await focusControl(list);
  // focus already activates firstItem (first enabled)
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');

  await firePointer(secondItem);

  // disabled item must NOT become active
  expect(list.getAttribute('aria-activedescendant')).not.toBe(secondItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

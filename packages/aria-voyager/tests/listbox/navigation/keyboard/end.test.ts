import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigates with `End`', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('focus list to activate first item');
  list.focus();
  expect(document.activeElement).toBe(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

  await annotate('use `End` key to activate last item');
  await fireKey(list, 'End');
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

test('Navigates with `End`, skip disabled item', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  thirdItem.setAttribute('aria-disabled', 'true');

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('focus list to activate first item');
  list.focus();
  expect(document.activeElement).toBe(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

  await annotate('use `End` key to activate second last item');
  await fireKey(list, 'End');
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

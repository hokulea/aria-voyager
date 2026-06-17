import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('use pointer to activate items', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the list activates first item');
  await userEvent.click(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the second item activates it');
  await userEvent.click(secondItem);
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('clicking the third item activates it');
  await userEvent.click(thirdItem);
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('Navigate with `ArrowDown`', async ({ annotate }) => {
  await annotate('Arrange');

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

  await annotate('use `ArrowDown` key to activate second item');
  await userEvent.keyboard('{ArrowDown}');

  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('use `ArrowDown` key to activate third item');
  await userEvent.keyboard('{ArrowDown}');

  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');

  await annotate('use `ArrowDown` key, but keep third item activated (hit end of list)');
  await userEvent.keyboard('{ArrowDown}');

  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

test('Navigate with `ArrowDown`, skip disabled item', async ({ annotate }) => {
  await annotate('Arrange');

  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('focus list to activate first item');
  list.focus();
  expect(document.activeElement).toBe(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

  await annotate('use `ArrowDown` key to activate third item');
  await userEvent.keyboard('{ArrowDown}');

  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

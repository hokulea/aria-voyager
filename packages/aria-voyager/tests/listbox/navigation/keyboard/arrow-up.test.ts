import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('Navigate with `ArrowUp`', async ({ annotate }) => {
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
  await userEvent.keyboard('{End}');
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');

  await annotate('use `ArrowUp` key to activate second item');
  await userEvent.keyboard('{ArrowUp}');
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('use `ArrowUp` key to activate first item');
  await userEvent.keyboard('{ArrowUp}');
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('use `ArrowUp` key, but keep first item activated (hit beginning of list)');
  await userEvent.keyboard('{ArrowUp}');
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

test('Navigate with `ArrowUp`, skip disabled item', async ({ annotate }) => {
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

  await annotate('use `End` key to activate last item');
  await userEvent.keyboard('{End}');
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');

  await annotate('use `ArrowUp` key to activate first item');
  await userEvent.keyboard('{ArrowUp}');
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

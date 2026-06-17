import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('navigates with `Home`', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('focus list and activate last item');
  list.focus();
  expect(document.activeElement).toBe(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await userEvent.keyboard('{End}');
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);

  await annotate('use `Home` key to activate first item');
  await userEvent.keyboard('{Home}');
  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

test('navigates with `Home`, skip disabled item', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  firstItem.setAttribute('aria-disabled', 'true');

  await expect.element(list).not.toHaveAttribute('aria-activedescendant');
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');

  await annotate('focus list and activate last item');
  list.focus();
  expect(document.activeElement).toBe(list);
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await userEvent.keyboard('{End}');
  expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);

  await annotate('use `Home` key to activate second item');
  await userEvent.keyboard('{Home}');
  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});

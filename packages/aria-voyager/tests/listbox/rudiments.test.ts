import { expect, test } from 'vitest';

import { Listbox } from '#src';

import { focusControl } from '#tests/test-support/events';

import { createListElement, createListWithFruits, getItems } from './-shared';

test('renders', () => {
  const list = createListWithFruits();

  expect(list.children.length).toBe(3);
});

test('initialization', async () => {
  const list = createListElement(document.body);

  new Listbox(list);

  await expect.element(list).toHaveAttribute('role', 'listbox');
  await expect.element(list).toHaveAttribute('tabindex', '0');
});

test('reads items', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  expect(listbox.items.length).toBe(3);
});

test('items have ids', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  for (const item of listbox.items) {
    expect(item.id).toBeTruthy();
  }
});

test('disabled: focus does not work', async () => {
  const list = createListWithFruits();

  list.setAttribute('aria-disabled', 'true');

  const listbox = new Listbox(list);

  list.dispatchEvent(new FocusEvent('focusin'));

  for (const elem of listbox.items) {
    await expect.element(elem).not.toHaveAttribute('aria-selected');
  }
});

test('focus lands on first enabled item when first item is disabled', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  firstItem.setAttribute('aria-disabled', 'true');
  listbox.readItems();

  await focusControl(list);

  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
});

test('checkable: sets aria-multiselectable', async () => {
  const list = createListWithFruits();

  new Listbox(list, { check: true });

  await expect.element(list).toHaveAttribute('aria-multiselectable', 'true');
});

test('checkable: items get aria-checked="false"', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { check: true });

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-checked', 'false');
  }
});

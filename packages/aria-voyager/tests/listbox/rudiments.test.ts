import { expect, test } from 'vitest';

import { Listbox } from '#src';

import { createListElement, createListWithFruits } from './-shared';

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

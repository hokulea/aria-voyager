import { expect, test } from 'vitest';

import { Listbox, ReactiveUpdateStrategy } from '#src';
import { appendItemToList } from '#tests/components/list';

import { createListWithFruits, getItems } from '../-shared';

test('Reactive Updater', async ({ annotate }) => {
  const list = createListWithFruits();
  const updater = new ReactiveUpdateStrategy();
  const listbox = new Listbox(list, { updater });

  expect(listbox.items.length).toBe(3);

  await annotate('reads elements on appending');
  appendItemToList('Grapefruit', list);
  updater.updateItems();
  expect(listbox.items.length).toBe(4);

  await annotate('reads selection on external update');

  const { secondItem } = getItems(listbox);

  expect(listbox.selection.length).toBe(0);
  secondItem.setAttribute('aria-selected', 'true');
  updater.updateSelection();
  expect(listbox.selection.length).toBe(1);
  expect(list).toHaveAttribute('aria-activedescendant', secondItem.id);

  await annotate('detects multi-select');
  expect(listbox.options.multiple).toBeFalsy();
  list.setAttribute('aria-multiselectable', 'true');
  updater.updateOptions();
  expect(listbox.options.multiple).toBeTruthy();

  await annotate('detects single-select');
  expect(listbox.options.multiple).toBeTruthy();
  list.removeAttribute('aria-multiselectable');
  updater.updateOptions();
  expect(listbox.options.multiple).toBeFalsy();

  await annotate('sets tabindex to -1 when aria-disabled is true');
  await expect.element(list).toHaveAttribute('tabindex', '0');
  list.setAttribute('aria-disabled', 'true');
  updater.updateOptions();
  await expect.element(list).toHaveAttribute('tabindex', '-1');

  await annotate('re-sets tabindex to 0 when aria-disabled is removed');
  await expect.element(list).toHaveAttribute('tabindex', '-1');
  list.removeAttribute('aria-disabled');
  updater.updateOptions();
  await expect.element(list).toHaveAttribute('tabindex', '0');
});

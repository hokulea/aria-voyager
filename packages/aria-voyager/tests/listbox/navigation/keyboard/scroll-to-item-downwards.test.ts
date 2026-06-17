import { expect, test } from 'vitest';

import { List } from '#tests/components/list';
import { getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('Scroll Downwards', async ({ annotate }) => {
  const listbox = new List(document.body);
  const list = listbox.element;

  list.style.height = '200px';
  list.style.position = 'relative';
  list.style.display = 'grid';
  list.style.overflow = 'auto';

  // eslint-disable-next-line unicorn/prefer-iterator-to-array
  listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
  for (const item of listbox.items) item.style.height = '19px';

  const { firstItem } = getItems(listbox.listbox);

  expect(list.scrollTop).toBe(0);

  await annotate('focus list to activate first item');
  list.focus();
  expect(document.activeElement).toBe(list);
  await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);

  await annotate('use `ArrowDown` to scroll down');

  let i = 0;

  while (i <= 8) {
    await fireKey(list, 'ArrowDown');
    i++;
  }

  expect(list.scrollTop).toBe(0);
  await expect.element(list.children[i] as HTMLElement).toHaveAttribute('aria-selected', 'true');

  await fireKey(list, 'ArrowDown');
  expect(Math.round(list.scrollTop)).toBe(11);
  await expect
    .element(list.children[i + 1] as HTMLElement)
    .toHaveAttribute('aria-selected', 'true');

  await fireKey(list, 'ArrowDown');
  expect(Math.round(list.scrollTop)).toBe(30);
  await expect
    .element(list.children[i + 2] as HTMLElement)
    .toHaveAttribute('aria-selected', 'true');
});

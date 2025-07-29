import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { List } from '../../../components/list';

const listbox = new List(document.body);
const list = listbox.element;

list.style.height = '200px';
list.style.position = 'relative';
list.style.display = 'grid';
list.style.overflow = 'auto';

listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
for (const item of listbox.items) item.style.height = '19px';

const lastIndex = list.children.length;
const lastItem = list.children[lastIndex - 1];

describe('Scroll Upwards', () => {
  expect(list.scrollTop).toBe(0);

  test('focus list and activate last item', async () => {
    list.focus();
    await expect.element(list).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect.element(list).toHaveAttribute('aria-activedescendant', lastItem.id);
  });

  test('use `ArrowUp` to scroll up', async () => {
    let i = lastIndex - 1;

    while (i >= 11) {
      await userEvent.keyboard('{ArrowUp}');
      i--;
    }

    expect(list.scrollTop).toBe(180);
    await expect.element(list.children[i]).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowUp}');
    expect(list.scrollTop).toBe(169);
    await expect.element(list.children[i - 1]).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowUp}');
    expect(list.scrollTop).toBe(150);
    await expect.element(list.children[i - 2]).toHaveAttribute('aria-selected', 'true');
  });
});

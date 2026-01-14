import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { List } from '#tests/components/list';

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
    expect(document.activeElement).toBe(list);

    await userEvent.keyboard('{End}');
    expect(list.getAttribute('aria-activedescendant')).toBe(lastItem.id);
  });

  test('use `ArrowUp` to scroll up', async () => {
    let i = lastIndex - 1;

    while (i >= 11) {
      await userEvent.keyboard('{ArrowUp}');
      i--;
    }

    expect(Math.round(list.scrollTop)).toBe(180);
    expect(list.children[i].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowUp}');
    expect(Math.round(list.scrollTop)).toBe(169);
    expect(list.children[i - 1].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowUp}');
    expect(Math.round(list.scrollTop)).toBe(150);
    expect(list.children[i - 2].getAttribute('aria-selected')).toBe('true');
  });
});

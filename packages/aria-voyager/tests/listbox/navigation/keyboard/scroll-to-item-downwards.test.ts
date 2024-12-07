import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { List } from '../../../components/list';

const listbox = new List(document.body);
const list = listbox.element;

list.style.height = '200px';
list.style.position = 'relative';
list.style.display = 'grid';
list.style.overflow = 'auto';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
listbox.setItems([...Array(20).keys()].map((i) => `Item ${i + 1}`));
listbox.items.forEach((item) => (item.style.height = '19px'));

const firstItem = list.children[0];

describe('Scroll Downwards', () => {
  expect(list.scrollTop).toBe(0);

  test('focus list to activate first item', () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  test('use `ArrowDown` to scroll down', async () => {
    let i = 0;

    while (i <= 8) {
      await userEvent.keyboard('{ArrowDown}');
      i++;
    }

    expect(list.scrollTop).toBe(0);
    expect(list.children[i].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(11);
    expect(list.children[i + 1].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(30);
    expect(list.children[i + 2].getAttribute('aria-selected')).toBe('true');
  });
});

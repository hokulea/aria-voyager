import { describe, expect, it } from 'vitest';

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

const lastIndex = list.children.length;
const lastItem = list.children[lastIndex - 1];

describe('Scroll Upwards', () => {
  expect(list.scrollTop).toBe(0);

  it('use `End` key to activate last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(lastItem.getAttribute('aria-selected')).toBe('true');
    expect(list.scrollTop).toBe(180);
  });

  it('use `ArrowUp` to scroll up', () => {
    let i = lastIndex - 1;

    while (i >= 11) {
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      i--;
    }

    expect(list.scrollTop).toBe(180);
    expect(list.children[i].getAttribute('aria-selected')).toBe('true');

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(list.scrollTop).toBe(169);
    expect(list.children[i - 1].getAttribute('aria-selected')).toBe('true');

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(list.scrollTop).toBe(150);
    expect(list.children[i - 2].getAttribute('aria-selected')).toBe('true');
  });
});

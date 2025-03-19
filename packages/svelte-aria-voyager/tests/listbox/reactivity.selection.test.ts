import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';

describe('Reactivity: selection', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const element = screen.getByRole('listbox');
  const list = element.element() as HTMLElement;

  test('selection works', async () => {
    const handleUpdate = vi.fn();

    await screen.rerender({
      select: handleUpdate,
      selection: 'Apple'
    });

    list.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(handleUpdate).toBeCalledWith('Pear');
  });
});

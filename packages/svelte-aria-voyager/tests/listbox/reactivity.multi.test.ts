import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { getListboxOptions } from './-list';

describe('Reactivity: multi', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const element = screen.getByRole('listbox');
  const list = element.element() as HTMLElement;

  test('multi works', async () => {
    const handleUpdate = vi.fn();

    await screen.rerender({
      select: handleUpdate
    });

    const options = getListboxOptions(list);
    const [first, second, last] = options;

    expect(list).not.toHaveAttribute('aria-multiselectable');

    await userEvent.click(last);
    expect(handleUpdate).toBeCalledWith('Pear');

    await screen.rerender({
      multi: true
    });

    expect(list).toHaveAttribute('aria-multiselectable');

    await userEvent.click(first);

    expect(handleUpdate).toBeCalledWith(['Banana']);

    await userEvent.keyboard('{Meta>}');
    await userEvent.click(second);
    await userEvent.keyboard('{/Meta}');

    expect(handleUpdate).toBeCalledWith(['Banana', 'Apple']);

    await screen.rerender({
      multi: false
    });

    expect(list).not.toHaveAttribute('aria-multiselectable');

    await userEvent.click(last);
    expect(handleUpdate).toBeCalledWith('Pear');
  });
});

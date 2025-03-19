import { describe } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { testListboxForPointerSingleSelection } from './-list';

describe('Selection (Single): Pointer', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const list = screen.getByRole('listbox');

  testListboxForPointerSingleSelection(list);
});

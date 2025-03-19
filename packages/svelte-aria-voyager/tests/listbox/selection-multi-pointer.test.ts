import { describe } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { testListboxForPointerMultiSelection } from './-list';

describe.only('Selection (Multi): Pointer', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear'],
    multi: true
  });

  const list = screen.getByRole('listbox');

  testListboxForPointerMultiSelection(list);
});

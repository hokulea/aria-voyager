// @ts-expect-error yeah, using internal API... totally not risky
import * as $ from 'svelte/internal/client';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';

import List from '../components/List.svelte';

import type { Snippet } from 'svelte';

/* eslint-disable @typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
// @ts-expect-error yeah, there are not really types for this
const item: Snippet<[unknown]> = ($$anchor: never, option = $.noop) => {
  $.next();

  let text = $.text();

  $.template_effect(() => $.set_text(text, option()));
  $.append($$anchor, text);
};
/* eslint-enable */

test('first item', async () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear'],
    item,
    // @ts-expect-error bcz it starts with $$
    $$slots: { item: true }
  });

  await expect.element(screen.getByRole('option').first()).toHaveAccessibleName('Banana');
  await expect.element(screen.getByRole('listbox')).toBeEnabled();
});

test('second item', async () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear'],
    item,
    // @ts-expect-error bcz it starts with $$
    $$slots: { item: true }
  });

  await expect.element(screen.getByRole('option').nth(1)).toHaveAccessibleName('Apple');
  await expect.element(screen.getByRole('listbox')).toBeEnabled();
});

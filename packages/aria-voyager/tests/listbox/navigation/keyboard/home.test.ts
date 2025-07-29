import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('navigates with `Home`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBeNull();
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list and activate last item', async () => {
    list.focus();
    await expect.poll(() => document.activeElement).toBe(list);
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

    await userEvent.keyboard('{End}');
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });
});

describe('navigates with `Home`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  firstItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBeNull();
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list and activate last item', async () => {
    list.focus();

    await expect.poll(() => document.activeElement).toBe(list);
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(secondItem.id);

    await userEvent.keyboard('{End}');
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('Navigates with `End`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.element(list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', async () => {
    list.focus();
    await expect.element(list).toBeFocused();
    await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(list).toHaveAttribute('aria-activedescendant', thirdItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
  });
});

describe('Navigates with `End`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', async () => {
    list.focus();
    await expect.element(list).toBeFocused();
    await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);
  });

  test('use `End` key to activate second last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(list).toHaveAttribute('aria-activedescendant', secondItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });
});

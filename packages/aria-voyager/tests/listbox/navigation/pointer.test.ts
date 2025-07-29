import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../src';
import { createListWithFruits, getItems } from '../-shared';

describe('use pointer to activate items', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => expect.element(list)).not.toHaveAttribute('aria-activedescendant');
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('clicking the list activates first item', async () => {
    await userEvent.click(list);

    await expect
      .poll(() => expect.element(list))
      .toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('clicking the second item activates it', async () => {
    await userEvent.click(secondItem);

    await expect
      .poll(() => expect.element(list))
      .toHaveAttribute('aria-activedescendant', secondItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('clicking the third item activates it', async () => {
    await userEvent.click(thirdItem);

    await expect
      .poll(() => expect.element(list))
      .toHaveAttribute('aria-activedescendant', thirdItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-current', 'true');
  });
});

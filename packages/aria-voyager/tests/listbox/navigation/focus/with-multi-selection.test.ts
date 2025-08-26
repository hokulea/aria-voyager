import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Focus activates first item of selection (Multi Select)', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('select two items', async () => {
    // await user.click(secondItem);

    // https://github.com/hokulea/aria-voyager/issues/259
    const user = userEvent.setup();

    await user.click(secondItem);
    await user.keyboard('{Shift>}');
    await user.click(thirdItem);
    await user.keyboard('{/Shift}');

    // secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    // thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of listbox.items) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-current'));
    }
  });

  test('refocus keeps selection', async () => {
    await userEvent.tab();
    await userEvent.tab({ shift: true });

    expect(list).toHaveAttribute('aria-activedescendant', secondItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });
});

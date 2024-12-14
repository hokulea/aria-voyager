import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../-shared';

describe('Focus activates first item of selection (Multi Select)', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('select two items', () => {
    // await user.click(secondItem);

    // https://github.com/hokulea/aria-voyager/issues/259
    // const user = userEvent.setup();
    // await user.keyboard('{Shift>}');
    // await user.click(thirdItem);
    // await user.keyboard('{/Shift}');

    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');

    expect(
      listbox.items.map((item) => item.getAttribute('aria-current')).every(Boolean)
    ).toBeFalsy();
  });

  test('refocus keeps selection', async () => {
    await userEvent.tab();
    await userEvent.tab({ shift: true });

    expect(list).toHaveAttribute('aria-activedescendant', secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});

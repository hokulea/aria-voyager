import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Navigate with `End`', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await focusControl(container);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);
});

test('Navigate with `End`, skip disabled item', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  fifthItem.setAttribute('aria-disabled', 'true');

  await focusControl(container);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `End` key to activate second last item');
  await fireKey(container, 'End');
  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', fourthItem);
});

import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Navigate with `ArrowDown`', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem, lastItem } =
    getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  await focusControl(container);
  expect(document.activeElement).toBe(firstItem);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(container, 'ArrowDown');
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', secondItem);

  await annotate('use `ArrowDown` key to activate third item');
  await fireKey(container, 'ArrowDown');
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(lastItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', lastItem);

  await annotate('use `ArrowDown` at last item → stays on last');
  await fireKey(container, 'ArrowDown');
  await expect.element(lastItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', lastItem);
});

test('Navigate with `ArrowDown`, skip disabled item', async ({ annotate }) => {
  await annotate('Arrange');

  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  secondItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('focus radio group to activate first item');
  await focusControl(container);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `ArrowDown` key to activate third item');
  await fireKey(container, 'ArrowDown');
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);
});

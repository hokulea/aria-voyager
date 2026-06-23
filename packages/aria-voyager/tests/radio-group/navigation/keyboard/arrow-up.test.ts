import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Navigate with `ArrowUp`', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);

  await annotate('use `ArrowUp` key to activate second item');
  await fireKey(container, 'ArrowUp');
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', secondItem);

  await annotate('use `ArrowDown` key to activate first item');
  await fireKey(container, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);
});

test('Navigate with `ArrowUp`, skip disabled item', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  secondItem.setAttribute('aria-disabled', 'true');

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);

  await annotate('use `ArrowUp` key to activate first item');
  await fireKey(container, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);
});

import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Navigate with `Home`', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  await focusControl(container);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(fifthItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', fifthItem);

  await annotate('use `Home` key to activate first item');
  await fireKey(container, 'Home');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);
});

test('Navigate with `Home`, skip disabled item', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  firstItem.setAttribute('aria-disabled', 'true');
  radioGroup.readItems();

  await focusControl(container);
  expect(document.activeElement).toBe(secondItem);
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', secondItem);

  await annotate('use `End` key to activate last item');
  await fireKey(container, 'End');
  await expect.element(fifthItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', fifthItem);

  await annotate('use `Home` key to activate second item');
  await fireKey(container, 'Home');
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', secondItem);
});

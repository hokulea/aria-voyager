import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

test('renders', () => {
  const { radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  expect(radioGroup.items.length).toBe(5);
});

test('setup', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem } = getItems(radioGroup);

  await annotate('sets role="radiogroup"');
  await expect.element(container).toHaveAttribute('role', 'radiogroup');

  await annotate('sets tabindex on the container');
  await expect.element(container).toHaveAttribute('tabindex', '0');

  await annotate('sets tabindex on the first item');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  await annotate('sets tabindex="-1" on other items');

  for (let i = 1; i < radioGroup.items.length; i++) {
    await expect.element(radioGroup.items[i]).toHaveAttribute('tabindex', '-1');
  }
});

test('disabled', async () => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  container.setAttribute('aria-disabled', 'true');

  for (const item of radioGroup.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('aria-checked invariant: none checked → check first', async () => {
  const { radioGroup } = createRadioGroup(document.body, ['Option 1', 'Option 2', 'Option 3']);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');
});

test('aria-checked invariant: multiple checked → pick first', async () => {
  const element = document.createElement('div');

  element.role = 'radiogroup';

  // Pre-set multiple checked items
  const item1 = document.createElement('button');

  item1.role = 'radio';
  item1.setAttribute('aria-checked', 'true');
  item1.textContent = 'Option 1';

  const item2 = document.createElement('button');

  item2.role = 'radio';
  item2.setAttribute('aria-checked', 'true');
  item2.textContent = 'Option 2';

  const item3 = document.createElement('button');

  item3.role = 'radio';
  item3.setAttribute('aria-checked', 'true');
  item3.textContent = 'Option 3';

  element.append(item1, item2, item3);

  const { RadioGroup } = await import('#src');
  const radioGroup = new RadioGroup(element);

  // Should pick first, uncheck rest
  await expect.element(item1).toHaveAttribute('aria-checked', 'true');
  await expect.element(item2).toHaveAttribute('aria-checked', 'false');
  await expect.element(item3).toHaveAttribute('aria-checked', 'false');

  radioGroup.dispose();
});

test('aria-checked invariant: one checked → keep it', async () => {
  const element = document.createElement('div');

  element.role = 'radiogroup';

  const item1 = document.createElement('button');

  item1.role = 'radio';
  item1.textContent = 'Option 1';

  const item2 = document.createElement('button');

  item2.role = 'radio';
  item2.setAttribute('aria-checked', 'true');
  item2.textContent = 'Option 2';

  const item3 = document.createElement('button');

  item3.role = 'radio';
  item3.textContent = 'Option 3';

  element.append(item1, item2, item3);

  const { RadioGroup } = await import('#src');
  const radioGroup = new RadioGroup(element);

  // Should keep the second item checked
  await expect.element(item1).toHaveAttribute('aria-checked', 'false');
  await expect.element(item2).toHaveAttribute('aria-checked', 'true');
  await expect.element(item3).toHaveAttribute('aria-checked', 'false');

  radioGroup.dispose();
});

import { expect, test } from 'vitest';

import { RadioGroup } from '#src';
import { appendRadioItem, createRadioGroupElement } from '#tests/components/radio-group';

import { fireKey, firePointer } from '#tests/test-support/events';

test('Multiple groups: independent checked states', async ({ annotate }) => {
  const container = createRadioGroupElement(document.body);

  // Group A: alignment
  appendRadioItem(container, 'Top', { group: 'alignment' });
  appendRadioItem(container, 'Bottom', { group: 'alignment' });

  // Group B: position
  appendRadioItem(container, 'Left', { group: 'position' });
  appendRadioItem(container, 'Right', { group: 'position' });

  const radioGroup = new RadioGroup(container);

  const topBtn = container.querySelector(':scope [role="radio"]') as HTMLElement;
  const bottomBtn = container.querySelectorAll(':scope [role="radio"]')[1] as HTMLElement;
  const leftBtn = container.querySelectorAll(':scope [role="radio"]')[2] as HTMLElement;
  const rightBtn = container.querySelectorAll(':scope [role="radio"]')[3] as HTMLElement;

  await annotate('Each group has first item checked by default');
  await expect.element(topBtn).toHaveAttribute('aria-checked', 'true');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(leftBtn).toHaveAttribute('aria-checked', 'true');
  await expect.element(rightBtn).toHaveAttribute('aria-checked', 'false');

  await annotate('Click Bottom → only affects alignment group');
  await firePointer(bottomBtn);

  await expect.element(topBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'true');
  // Position group unaffected
  await expect.element(leftBtn).toHaveAttribute('aria-checked', 'true');
  await expect.element(rightBtn).toHaveAttribute('aria-checked', 'false');

  await annotate('Click Right → only affects position group');
  await firePointer(rightBtn);

  // Alignment group unaffected
  await expect.element(topBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'true');
  // Position group updated
  await expect.element(leftBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(rightBtn).toHaveAttribute('aria-checked', 'true');

  radioGroup.dispose();
});

test('No data-group: all items form default group', async ({ annotate }) => {
  const container = createRadioGroupElement(document.body);

  // No data-group → all items are in default group
  appendRadioItem(container, 'Option 1');
  appendRadioItem(container, 'Option 2');
  appendRadioItem(container, 'Option 3');

  const radioGroup = new RadioGroup(container);

  const item1 = container.querySelector(':scope [role="radio"]') as HTMLElement;
  const item2 = container.querySelectorAll(':scope [role="radio"]')[1] as HTMLElement;
  const item3 = container.querySelectorAll(':scope [role="radio"]')[2] as HTMLElement;

  await annotate('First item checked by default');
  await expect.element(item1).toHaveAttribute('aria-checked', 'true');
  await expect.element(item2).toHaveAttribute('aria-checked', 'false');
  await expect.element(item3).toHaveAttribute('aria-checked', 'false');

  await annotate('Click second item → unchecks first');
  await firePointer(item2);

  await expect.element(item1).toHaveAttribute('aria-checked', 'false');
  await expect.element(item2).toHaveAttribute('aria-checked', 'true');
  await expect.element(item3).toHaveAttribute('aria-checked', 'false');

  radioGroup.dispose();
});

test('Mixed: items with and without data-group coexist', async ({ annotate }) => {
  const container = createRadioGroupElement(document.body);

  // Items with data-group
  appendRadioItem(container, 'Top', { group: 'alignment' });
  appendRadioItem(container, 'Bottom', { group: 'alignment' });

  // Items without data-group (default group)
  appendRadioItem(container, 'Default 1');
  appendRadioItem(container, 'Default 2');

  const radioGroup = new RadioGroup(container);

  const topBtn = container.querySelector(':scope [role="radio"]') as HTMLElement;
  const bottomBtn = container.querySelectorAll(':scope [role="radio"]')[1] as HTMLElement;
  const default1 = container.querySelectorAll(':scope [role="radio"]')[2] as HTMLElement;
  const default2 = container.querySelectorAll(':scope [role="radio"]')[3] as HTMLElement;

  await annotate('Each group has first item checked');
  await expect.element(topBtn).toHaveAttribute('aria-checked', 'true');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(default1).toHaveAttribute('aria-checked', 'true');
  await expect.element(default2).toHaveAttribute('aria-checked', 'false');

  await annotate('Click Bottom → only affects alignment group');
  await firePointer(bottomBtn);

  await expect.element(topBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'true');
  // Default group unaffected
  await expect.element(default1).toHaveAttribute('aria-checked', 'true');
  await expect.element(default2).toHaveAttribute('aria-checked', 'false');

  await annotate('Click Default 2 → only affects default group');
  await firePointer(default2);

  // Alignment group unaffected
  await expect.element(topBtn).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottomBtn).toHaveAttribute('aria-checked', 'true');
  // Default group updated
  await expect.element(default1).toHaveAttribute('aria-checked', 'false');
  await expect.element(default2).toHaveAttribute('aria-checked', 'true');

  radioGroup.dispose();
});

test('Arrow keys navigate within same group only', async ({ annotate }) => {
  const container = createRadioGroupElement(document.body);

  // Group A
  appendRadioItem(container, 'A1', { group: 'A' });
  appendRadioItem(container, 'A2', { group: 'A' });

  // Group B
  appendRadioItem(container, 'B1', { group: 'B' });
  appendRadioItem(container, 'B2', { group: 'B' });

  const radioGroup = new RadioGroup(container);

  const a1 = container.querySelector(':scope [role="radio"]') as HTMLElement;
  const a2 = container.querySelectorAll(':scope [role="radio"]')[1] as HTMLElement;
  const b1 = container.querySelectorAll(':scope [role="radio"]')[2] as HTMLElement;
  const b2 = container.querySelectorAll(':scope [role="radio"]')[3] as HTMLElement;

  // Initial state: A1 and B1 checked
  await expect.element(a1).toHaveAttribute('aria-checked', 'true');
  await expect.element(b1).toHaveAttribute('aria-checked', 'true');

  a1.focus();

  await annotate('ArrowDown from A1 → moves to A2 (same group)');
  await fireKey(container, 'ArrowDown');

  await expect.element(a2).toHaveAttribute('tabindex', '0');
  await expect.element(a2).toHaveAttribute('aria-checked', 'true');
  await expect.element(a1).toHaveAttribute('aria-checked', 'false');

  // B group unaffected
  await expect.element(b1).toHaveAttribute('aria-checked', 'true');
  await expect.element(b2).toHaveAttribute('aria-checked', 'false');

  radioGroup.dispose();
});

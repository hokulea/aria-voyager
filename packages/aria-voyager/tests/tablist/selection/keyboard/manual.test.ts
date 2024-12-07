import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select manually with spacebar`', () => {
  const { tabs } = createTabs({
    behavior: {
      singleSelection: 'manual'
    }
  });
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();

    expect(fourthItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 3)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use spacebar to select fourth item', async () => {
    await userEvent.keyboard('{ }');

    expect(fourthItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 4).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowLeft` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(fourthItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 4).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use spacebar to select second item', async () => {
    await userEvent.keyboard('{ }');

    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });
});

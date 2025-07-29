import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select with `ArrowLeft`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => lastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => secondLastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => thirdLastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

describe('select with `ArrowLeft`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => lastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => secondLastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => fourthLastItem.getAttribute('aria-selected')).toBe('true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

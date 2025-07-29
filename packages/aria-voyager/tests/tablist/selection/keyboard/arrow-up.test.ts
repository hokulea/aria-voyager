import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select with `ArrowUp`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toHaveFocus();
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect
      .poll(() => expect.element(secondLastItem))
      .toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(thirdLastItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

describe('select with `ArrowUp`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toHaveFocus();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect
      .poll(() => expect.element(secondLastItem))
      .toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect
      .poll(() => expect.element(fourthLastItem))
      .toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))
          .every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

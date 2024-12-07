import { describe, expect, test } from 'vitest';

import { Menu, ReactiveUpdateStrategy } from '../../../src';
import { appendItemToMenu } from '../../components/menu';
import { createCodeMenu } from '../-shared';

describe('Reactive Updater', () => {
  const { codeMenu } = createCodeMenu();
  const updater = new ReactiveUpdateStrategy();
  const menu = new Menu(codeMenu, {
    updater
  });

  test('start', () => {
    expect(menu.items.length).toBe(11);
  });

  test('reads elements on appending', () => {
    appendItemToMenu(codeMenu, 'Command Palette');

    updater.updateItems();

    expect(menu.items.length).toBe(12);
  });

  describe('read options', () => {
    test('sets tabindex to -1 when the aria-disabled is `true`', () => {
      expect(menu.items[0].getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .slice(1)
          .map((item) => item.getAttribute('tabindex') === '-1')
          .every(Boolean)
      ).toBeTruthy();

      codeMenu.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      expect(
        menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', () => {
      expect(
        menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();

      codeMenu.removeAttribute('aria-disabled');

      updater.updateOptions();

      expect(menu.items[0].getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .slice(1)
          .map((item) => item.getAttribute('tabindex') === '-1')
          .every(Boolean)
      ).toBeTruthy();
    });
  });
});

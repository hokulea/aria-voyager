import { describe, expect, it, vi } from 'vitest';

import { Menu, ReactiveUpdateStrategy } from '../../src';
import { appendItemToMenu } from '../components/menu';
import { createCodeMenu } from './-shared';

describe('Menu', () => {
  describe('Updates', () => {
    describe('DOM Observer', () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      expect(menu.items.length).toBe(11);

      it('reads elements on appending', async () => {
        appendItemToMenu(codeMenu, 'Command Palette');

        await vi.waitUntil(
          () =>
            codeMenu.querySelectorAll(
              '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]'
            ).length === 12
        );

        expect(menu.items.length).toBe(12);
      });

      describe('read options', () => {
        it('sets tabindex to -1 when the aria-disabled is `true`', async () => {
          expect(menu.items[0].getAttribute('tabindex')).toBe('0');
          expect(
            menu.items
              .slice(1)
              .map((item) => item.getAttribute('tabindex') === '-1')
              .every(Boolean)
          ).toBeTruthy();

          codeMenu.setAttribute('aria-disabled', 'true');

          await vi.waitUntil(() => codeMenu.getAttribute('aria-disabled') === 'true');

          expect(
            menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
          ).toBeTruthy();
        });

        it('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
          expect(
            menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
          ).toBeTruthy();

          codeMenu.removeAttribute('aria-disabled');

          await vi.waitUntil(() => codeMenu.getAttribute('aria-disabled') === null);

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

    // simulating a framework with a reactive library
    describe('Reactive Updater', () => {
      const { codeMenu } = createCodeMenu();
      const updater = new ReactiveUpdateStrategy();
      const menu = new Menu(codeMenu, {
        updater
      });

      expect(menu.items.length).toBe(11);

      it('reads elements on appending', () => {
        appendItemToMenu(codeMenu, 'Command Palette');

        updater.updateItems();

        expect(menu.items.length).toBe(12);
      });

      describe('read options', () => {
        it('sets tabindex to -1 when the aria-disabled is `true`', () => {
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

        it('re-sets tabindex to 0 when the aria-disabled is removed', () => {
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
  });
});

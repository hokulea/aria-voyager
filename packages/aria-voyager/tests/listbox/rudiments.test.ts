import { describe, expect, it } from 'vitest';

import { setupListbox } from './-shared';

describe('Listbox', () => {
  describe('renders', () => {
    const ctx = setupListbox();

    it('renders', () => {
      expect(ctx.list.children.length).toBe(3);
    });
  });

  describe('setup', () => {
    describe('initialization', () => {
      const ctx = setupListbox({ items: [] });

      it('has listbox role', async () => {
        await expect.element(ctx.list).toHaveAttribute('role', 'listbox');
      });

      it('sets tabindex', async () => {
        await expect.element(ctx.list).toHaveAttribute('tabindex', '0');
      });
    });

    describe('items', () => {
      const ctx = setupListbox();

      it('reads items', () => {
        expect(ctx.listbox.items.length).toBe(3);
      });

      it('items have ids', () => {
        for (const item of ctx.listbox.items) {
          expect(item.id).toBeTruthy();
        }
      });
    });
  });

  describe('disabled', () => {
    const ctx = setupListbox({ disabled: true });

    it('focus does not work', async () => {
      ctx.list.dispatchEvent(new FocusEvent('focusin'));

      for (const elem of ctx.listbox.items) {
        await expect.element(elem).not.toHaveAttribute('aria-selected');
      }
    });
  });
});

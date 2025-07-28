import { isItemEnabled } from '../controls/-utils';
import { AbstractFocusStrategy } from './focus-strategy';

import type { Item } from '../controls/control';

/**
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */
export class RovingTabindexStrategy extends AbstractFocusStrategy {
  activateItem(item: Item, forceFocus = false) {
    if (this.control.options.disabled) {
      return;
    }

    if (item !== this.activeItem) {
      item.setAttribute('tabindex', '0');

      // mark the previous one not active anymore
      if (this.activeItem) {
        this.prevActiveItem = this.activeItem;
        this.prevActiveItem.setAttribute('tabindex', '-1');
      }
    }

    // `forceFocus` may be coming in, when using `pointerover` event in a menu.
    // In that situation the focus can be on a parent menu and as such, the
    // `hasFocus` check will fail.
    // this is a very critical and unsafe implementation, but the only one known
    // so far.
    // To improve the situation:
    // 1. become aware of other situations triggering the same behavior
    // 2. use DOM relationships to do "parent" checks (`popovertarget` or
    //    `aria-controls` attributes)
    if (this.hasFocus() || forceFocus) {
      item.focus();
    }

    if (item !== this.activeItem) {
      // turn passed item active
      this.activeItem = item;
      this.control.emitter?.itemActivated(item);
    }
  }

  updateItems() {
    for (const item of this.control.items) {
      item.setAttribute('tabindex', '-1');
    }

    if (this.control.options.disabled) {
      this.activeItem?.setAttribute('tabindex', '-1');
      this.activeItem = undefined;
    } else {
      if (this.activeItem && isItemEnabled(this.activeItem)) {
        this.activeItem.setAttribute('tabindex', '0');
      } else {
        this.activeItem = undefined;
      }

      if (!this.activeItem && this.control.enabledItems.length > 0) {
        this.control.enabledItems[0].setAttribute('tabindex', '0');
      }
    }
  }
}

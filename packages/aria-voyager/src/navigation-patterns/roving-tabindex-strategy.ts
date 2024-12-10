import { isItemEnabled } from '../controls/-utils';
import { AbstractFocusStrategy } from './focus-strategy';

import type { Item } from '../controls/control';

/**
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */
export class RovingTabindexStrategy extends AbstractFocusStrategy {
  activateItem(item: Item) {
    if (item !== this.activeItem) {
      // turn passed item active
      item.setAttribute('tabindex', '0');

      this.prevActiveItem = this.activeItem;

      // mark the previous one not active anymore
      this.control.prevActiveItem?.setAttribute('tabindex', '-1');
    }

    item.focus();

    if (item !== this.activeItem) {
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

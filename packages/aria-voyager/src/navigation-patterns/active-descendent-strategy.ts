import { uniqueId } from '../utils';
import { AbstractFocusStrategy } from './focus-strategy';

import type { Item } from '../controls/control';

export class ActiveDescendentStrategy extends AbstractFocusStrategy {
  activateItem(item: Item) {
    if (item === this.activeItem) {
      return;
    }

    // turn passed item active
    item.setAttribute('aria-current', 'true');
    this.control.element.setAttribute('aria-activedescendant', item.id);

    this.prevActiveItem = this.activeItem;
    this.activeItem = item;

    // mark the previous one not active anymore
    this.control.prevActiveItem?.removeAttribute('aria-current');

    this.control.emitter?.itemActivated(item);
  }

  updateItems() {
    // @TODO
    for (const item of this.control.items) {
      if (!item.id) {
        item.id = uniqueId();
      }
    }
  }
}

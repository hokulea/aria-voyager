import { doesEventMatchKeys } from '../utils/event';

import type { Control } from '..';
import type { Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export class PreviousNavigation implements NavigationPattern {
  eventListeners: EventNames[] = ['keydown'];

  constructor(
    private control: Control,
    public keyOrKeys: string | string[]
  ) {}

  matches(event: Event): boolean {
    return doesEventMatchKeys(event, this.keyOrKeys) && this.control.enabledItems.length > 0;
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    let item: Item | undefined = undefined;

    if (this.control.activeItem) {
      const activeIndex = this.control.enabledItems.indexOf(this.control.activeItem);

      if (activeIndex !== 0) {
        item = this.control.enabledItems[activeIndex - 1];
      }
    }

    return {
      ...bag,
      item
    };
  }
}

import { doesEventMatchKeys } from '#src/utils/event';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control, Item } from '#src/controls/control';

export class NextNavigation implements Behavior {
  eventListeners: EventNames[] = ['keydown'];

  constructor(
    private control: Control,
    public keyOrKeys: string | string[]
  ) {}

  matches(event: Event): boolean {
    return doesEventMatchKeys(event, this.keyOrKeys) && this.control.enabledItems.length > 0;
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
    let item: Item | undefined = undefined;

    if (this.control.activeItem) {
      const activeIndex = this.control.enabledItems.indexOf(this.control.activeItem);

      // item is last;
      if (activeIndex !== this.control.enabledItems.length - 1) {
        item = this.control.enabledItems[activeIndex + 1];
      }
    }

    return {
      ...bag,
      item
    };
  }
}

import { doesEventMatchKeys } from '#src/utils/event';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control } from '#src/controls/control';

function isEndEvent(event: Event): boolean {
  return doesEventMatchKeys(event, 'End');
}

export class EndNavigation implements Behavior {
  eventListeners: EventNames[] = ['keydown'];

  constructor(private control: Control) {}

  matches(event: Event): boolean {
    return isEndEvent(event) && this.control.enabledItems.length > 0;
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
    const lastOffset = this.control.enabledItems.length - 1;

    return {
      ...bag,
      item: this.control.enabledItems[lastOffset]
    };
  }
}

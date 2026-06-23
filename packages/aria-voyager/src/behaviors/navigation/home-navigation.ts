import { doesEventMatchKeys } from '#src/utils/event';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control } from '#src/controls/control';

function isHomeEvent(event: Event): boolean {
  return doesEventMatchKeys(event, 'Home');
}

export class HomeNavigation implements Behavior {
  eventListeners: EventNames[] = ['keydown'];

  constructor(private control: Control) {}

  matches(event: Event): boolean {
    return isHomeEvent(event) && this.control.enabledItems.length > 0;
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
    return {
      ...bag,
      item: this.control.enabledItems[0]
    };
  }
}

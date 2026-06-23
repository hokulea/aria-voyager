import { asItemOf } from '#src/controls/-items';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control } from '#src/controls/control';

export class PointerNavigation implements Behavior {
  eventListeners: EventNames[];

  constructor(
    private control: Control,
    typeOrTypes: EventNames | EventNames[] = 'pointerup'
  ) {
    this.eventListeners = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
  }

  matches(event: Event): boolean {
    return this.eventListeners.includes(event.type as EventNames);
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
    const { event } = bag as BehaviorParameterBag & { event: PointerEvent };

    const item = event
      .composedPath()
      .find((elem) => asItemOf(elem as HTMLElement, this.control)) as HTMLElement | undefined;

    return {
      ...bag,
      item
    };
  }
}

import { asItemOf } from '../controls/-utils';

import type { Control } from '..';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export class PointerNavigation implements NavigationPattern {
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

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event } = bag as NavigationParameterBag & { event: PointerEvent };

    const item = event
      .composedPath()
      .find((elem) => asItemOf(elem as HTMLElement, this.control)) as HTMLElement | undefined;

    return {
      ...bag,
      item
    };
  }
}

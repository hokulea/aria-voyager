import type { Item } from '#src/controls/control';

export type BehaviorParameterBag = {
  event: Event;
  item?: Item;
};

export type EventNames = keyof HTMLElementEventMap;

export interface Behavior {
  eventListeners?: EventNames[];

  matches(event: Event): boolean;

  prepare?(event: Event): void;

  handle(bag: BehaviorParameterBag): BehaviorParameterBag;

  dispose?(): void;
}

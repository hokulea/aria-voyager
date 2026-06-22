import type { Item } from '#src/controls/control';

export interface SelectionStrategy {
  readonly selection: Item[];
  select(selection: Item[]): void;
  readSelection(): void;

  isSelectionAttriute(attributeName: string): boolean;

  addListener(event: string, handler: EventHandler): void;
  removeListener(event: string, handler: EventHandler): void;
}

export interface SelectionBehavior {
  /**
   * Selection behavior:
   *
   * - `automatic`: active item becomes selected item
   * - `manual`: user must select manually with spacebar
   *
   * @defaultValue `automatic`
   */
  singleSelection?: 'automatic' | 'manual';
}

export type SelectionEvent = 'read';
export type EventHandler = (...args: unknown[]) => void;

export abstract class AbstractSelectionStrategy implements /* NavigationPattern, */ SelectionStrategy {
  abstract readonly selection: Item[];

  #listeners: Record<SelectionEvent, Set<EventHandler>> = {
    read: new Set<EventHandler>()
  };

  dispose() {
    for (const listeners of Object.values(this.#listeners)) listeners.clear();
  }

  addListener(event: SelectionEvent, handler: EventHandler) {
    this.#listeners[event].add(handler);
  }

  removeListener(event: SelectionEvent, handler: EventHandler) {
    this.#listeners[event].delete(handler);
  }

  protected notifyListener(event: SelectionEvent) {
    for (const listener of this.#listeners[event]) {
      listener();
    }
  }

  abstract select(selection: Item[]): void;
  abstract readSelection(): void;
  abstract isSelectionAttriute(attributeName: string): boolean;
}

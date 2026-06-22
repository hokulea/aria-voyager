import type { Control, Item } from '#src/controls/control';

export interface SelectionStrategy {
  readonly selection: Item[];
  select(selection: Item[]): void;
  readSelection(): void;

  isSelectionAttriute(attributeName: string): boolean;
  shouldActivateSelectionOnFocus(): boolean;

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

  /**
   * When the control receives focus, shall the first selection item be activated?
   *
   * @defaultValue `true`
   */
  activateSelectionOnFocus?: boolean;
}

export type SelectionEvent = 'read';
export type EventHandler = (...args: unknown[]) => void;

const DEFAULT_BEHAVIOR: Required<SelectionBehavior> = {
  singleSelection: 'automatic',
  activateSelectionOnFocus: true
};

export abstract class AbstractSelectionStrategy implements /* NavigationPattern, */ SelectionStrategy {
  abstract readonly selection: Item[];

  #listeners: Record<SelectionEvent, Set<EventHandler>> = {
    read: new Set<EventHandler>()
  };

  protected control: Control;
  protected behavior: Required<SelectionBehavior>;

  constructor(control: Control, behavior?: SelectionBehavior) {
    this.control = control;
    this.behavior = {
      ...DEFAULT_BEHAVIOR,
      ...behavior
    };
  }

  dispose() {
    for (const listeners of Object.values(this.#listeners)) listeners.clear();
  }

  addListener(event: SelectionEvent, handler: EventHandler) {
    this.#listeners[event].add(handler);
  }

  removeListener(event: SelectionEvent, handler: EventHandler) {
    this.#listeners[event].delete(handler);
  }

  shouldActivateSelectionOnFocus() {
    return this.behavior.activateSelectionOnFocus;
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

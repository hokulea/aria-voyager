import { isEqual } from '../utils';

import type { Control } from '..';
import type { Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

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

const DEFAULT_BEHAVIOR: Required<SelectionBehavior> = {
  singleSelection: 'automatic'
};

type EventHandler = (...args: unknown[]) => void;

export class SelectionStrategy implements NavigationPattern {
  #listeners = {
    read: new Set<EventHandler>()
  };

  eventListeners: EventNames[] = ['focusin', 'keydown', 'keyup', 'pointerup', 'change'];

  #selection: Item[] = [];

  get selection(): Item[] {
    return this.#selection;
  }

  private shiftItem?: Item;
  private behavior: Required<SelectionBehavior>;

  constructor(
    private control: Control,
    behavior?: SelectionBehavior
  ) {
    this.behavior = {
      ...DEFAULT_BEHAVIOR,
      ...behavior
    };
    this.readSelection();
  }

  dispose() {
    for (const listeners of Object.values(this.#listeners)) listeners.clear();
  }

  addListener(event: 'read', handler: EventHandler) {
    this.#listeners[event].add(handler);
  }

  removeListener(event: 'read', handler: EventHandler) {
    this.#listeners[event].delete(handler);
  }

  matches(event: Event): boolean {
    return this.control.items.length > 0 && this.eventListeners.includes(event.type as EventNames);
  }

  prepare(event: Event): void {
    if (
      !this.shiftItem &&
      this.control.activeItem &&
      event instanceof KeyboardEvent &&
      event.shiftKey
    ) {
      this.shiftItem = this.control.activeItem;
    }
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event } = bag;

    if (event.type === 'focusin') {
      this.handleFocus();
    }

    // mouse
    else if (event.type === 'pointerup' && bag.item) {
      this.handlePointer(event as PointerEvent, bag.item);
    }

    // keyboard
    else if (event instanceof KeyboardEvent) {
      this.handleKeyboard(event, bag.item);
    }

    // this is usually triggered when testing
    // ie. a couple of options are _marked_ as selected
    // then the `change` event is triggered
    // to mimic one "user action" results in one event emitted
    else if (event.type === 'change') {
      this.handleChange();
    }

    return bag;
  }

  select(selection: Item[]) {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const items = selection.every(Number)
      ? selection
          .map((sel) => this.control.items.find((item) => item === sel))
          .filter((e) => e !== undefined)
      : selection;

    this.persistSelection(items);
  }

  readSelection() {
    this.#selection = [
      ...this.control.element.querySelectorAll('[aria-selected="true"]')
    ] as HTMLElement[];

    for (const listener of this.#listeners.read) {
      listener();
    }
  }

  private handleChange() {
    this.readSelection();

    this.control.emitter?.selected(this.#selection);
  }

  private handleFocus() {
    const multiple = this.control.options.multiple;
    const selectionPresent = this.#selection.length > 0;

    if (this.control.capabilities.singleSelection && !multiple && !selectionPresent) {
      this.selectSingle(this.control.items[0]);
    }
  }

  private handlePointer(event: PointerEvent, item: Item) {
    if (event.shiftKey) {
      this.selectShift(item);
    } else if (event.metaKey) {
      if (this.#selection.includes(item)) {
        this.deselect(item);
      } else {
        this.selectAdd(item);
      }
    } else {
      this.selectSingle(item);
    }
  }

  private handleKeyboard(event: KeyboardEvent, item?: Item) {
    if (event.type === 'keydown') {
      if (item) {
        this.handleItem(event, item);
      }

      this.handleKeys(event);
      this.handleKeyCombinations(event);
    } else if (event.type === 'keyup' && !event.shiftKey) {
      this.shiftItem = undefined;
    }
  }

  private handleItem(event: KeyboardEvent, item: Item) {
    if (this.control.options.multiple) {
      if (event.shiftKey) {
        this.selectShift(item);
      }
    } else {
      if (
        this.behavior.singleSelection === 'automatic' ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (this.behavior.singleSelection === 'manual' && event.key === ' ')
      ) {
        this.selectSingle(item);
      }
    }
  }

  private handleKeys(event: KeyboardEvent) {
    if (
      this.behavior.singleSelection === 'manual' &&
      event.key === ' ' &&
      this.control.activeItem
    ) {
      this.selectSingle(this.control.activeItem);
    }
  }

  /**
   * Handles special keyboard control cases, such as handling the spacebar key
   * and cmd/ctrl + a
   */
  private handleKeyCombinations(event: KeyboardEvent) {
    if (event.key === ' ' && this.control.activeItem && this.control.options.multiple) {
      // handle select and active item
      if (this.#selection.includes(this.control.activeItem)) {
        this.deselect(this.control.activeItem);
      } else {
        this.selectAdd(this.control.activeItem);
      }
    }

    // ctrl+a
    else if ((event.key === 'KeyA' || event.key === 'a') && event.metaKey) {
      this.selectAll();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // selection logic

  private deselect(item: HTMLElement) {
    if (this.#selection.includes(item)) {
      const selection = [...this.#selection];

      selection.splice(selection.indexOf(item), 1);
      this.persistSelection(selection);
    }
  }

  private selectSingle(item: HTMLElement) {
    this.shiftItem = item;

    this.persistSelection([item]);
  }

  private selectAdd(item: HTMLElement) {
    const selection = this.control.options.multiple ? [...this.#selection] : [];

    selection.push(item);

    this.shiftItem = item;
    this.persistSelection(selection);
  }

  private selectAll() {
    if (this.control.options.multiple) {
      this.persistSelection(this.control.items);
    }
  }

  private selectRange(from: number, to: number) {
    if (this.control.options.multiple) {
      const selection = [];
      let i = from;
      const up = to > from;

      while (up ? i <= to : i >= to) {
        selection.push(this.control.items[i]);
        i += up ? 1 : -1;
      }

      this.persistSelection(selection);
    }
  }

  private selectShift(item: HTMLElement) {
    // only, when selection mode is MULTI
    if (this.control.options.multiple && this.shiftItem) {
      const indexShift = this.control.items.indexOf(this.shiftItem);
      const indexItem = this.control.items.indexOf(item);

      this.selectRange(indexShift, indexItem);
    }
  }

  // talk to the control from here

  private persistSelection(selection: Item[]) {
    if (isEqual(selection, this.#selection)) {
      return;
    }

    for (const element of this.control.items) {
      if (selection.includes(element)) {
        element.setAttribute('aria-selected', 'true');
      } else {
        element.removeAttribute('aria-selected');
      }
    }

    this.#selection = selection;

    this.control.emitter?.selected(this.#selection);
  }
}

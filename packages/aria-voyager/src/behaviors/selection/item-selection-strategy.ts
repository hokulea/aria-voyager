import { isEqual } from 'es-toolkit/predicate';

import {
  AbstractSelectionStrategy,
  type SelectionBehavior,
  type SelectionStrategy
} from '#src/behaviors/selection/selection-strategy';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control, Item } from '#src/controls/control';

const SELECTION_ATTRIBUTE = 'aria-selected';

interface ItemSelectionOptions {
  behavior?: SelectionBehavior;
}

export class ItemSelectionStrategy
  extends AbstractSelectionStrategy
  implements SelectionStrategy, Behavior
{
  eventListeners: EventNames[] = ['focusin', 'keydown', 'keyup', 'pointerup', 'change'];

  #selection: Item[] = [];

  get selection(): Item[] {
    return this.#selection;
  }

  constructor(control: Control, options?: ItemSelectionOptions) {
    super(control, options?.behavior);

    this.readSelection();
  }

  private shiftItem?: Item;

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

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
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

  isSelectionAttriute(attributeName: string): boolean {
    return attributeName === SELECTION_ATTRIBUTE;
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
      ...this.control.element.querySelectorAll(':scope [aria-selected="true"]')
    ] as HTMLElement[];

    this.notifyListener('read');
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
    // eslint-disable-next-line unicorn/prefer-early-return
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
    // eslint-disable-next-line unicorn/prefer-early-return
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
    // eslint-disable-next-line unicorn/prefer-early-return
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

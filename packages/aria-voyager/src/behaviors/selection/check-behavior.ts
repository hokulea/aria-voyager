import { isEqual } from 'es-toolkit/predicate';

import { isItemEnabled } from '#src/controls/-items';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { SelectionStrategy } from '#src/behaviors/selection/selection-strategy';
import type { Control, Item } from '#src/controls/control';

export interface CheckBehaviorOptions {
  /**
   * Filter function to determine which items in control.items are checkable.
   *
   * @defaultValue `(item) => item.hasAttribute('aria-checked')`
   */
  isCheckableItem?: (item: Item) => boolean;

  /**
   * Selection strategy reference for batch-toggle operations.
   * When provided and the control is in multiselect mode, Space and Shift+Click
   * toggle all items in the current selection range rather than just the active item.
   */
  selectionStrategy?: SelectionStrategy;
}

/**
 * CheckBehavior manages aria-checked state for items that can be toggled independently.
 *
 * Unlike RadioNavigation (which enforces single-selection per group), CheckBehavior
 * allows any combination of items to be checked/unchecked.
 *
 * Used for:
 * - menuitemcheckbox in Menu
 * - option with aria-checked in Listbox
 * - treeitem with aria-checked in Tree
 */
export class CheckBehavior implements Behavior {
  eventListeners: EventNames[] = ['keydown', 'pointerup'];

  #checked: Item[] = [];
  #checkableItems: Item[] = [];
  #isCheckableItem: (item: Item) => boolean;
  #selectionStrategy?: SelectionStrategy;

  constructor(
    private control: Control,
    options?: CheckBehaviorOptions
  ) {
    this.#isCheckableItem =
      options?.isCheckableItem ?? ((item) => item.hasAttribute('aria-checked'));
    this.#selectionStrategy = options?.selectionStrategy;
  }

  matches(event: Event): boolean {
    return (
      this.#checkableItems.length > 0 && this.eventListeners.includes(event.type as EventNames)
    );
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
    const { event, item } = bag;

    if (event.type === 'pointerup') {
      this.#handlePointer(event as PointerEvent, item);
    }

    if (event.type === 'keydown') {
      this.#handleKeyboard(event as KeyboardEvent);
    }

    return bag;
  }

  #handlePointer(event: PointerEvent, item?: Item) {
    if (event.shiftKey && this.#selectionStrategy && this.control.options.multiple) {
      this.#batchToggleSelection();

      return;
    }

    if (item && this.#isCheckableItem(item) && isItemEnabled(item)) {
      this.#toggle(item);
    }
  }

  #handleKeyboard(event: KeyboardEvent) {
    if (event.key !== ' ' || !this.control.activeItem) {
      return;
    }

    event.preventDefault();

    if (
      this.#selectionStrategy &&
      this.#selectionStrategy.selection.length > 0 &&
      this.control.options.multiple
    ) {
      this.#batchToggleSelection();
    } else if (this.#isCheckableItem(this.control.activeItem)) {
      this.#toggle(this.control.activeItem);
    }
  }

  /**
   * Called from control.readItems() to re-filter checkable items and re-read state.
   */
  updateItems(): void {
    this.#checkableItems = this.control.enabledItems.filter((item) => this.#isCheckableItem(item));
    this.readChecked();
  }

  /**
   * Read aria-checked state from DOM.
   */
  readChecked(): void {
    this.#checked = this.#checkableItems.filter(
      (item) => item.getAttribute('aria-checked') === 'true'
    );
  }

  /**
   * Toggle an item's checked state.
   */
  #toggle(item: Item): void {
    const newChecked = item.getAttribute('aria-checked') !== 'true';

    item.setAttribute('aria-checked', newChecked ? 'true' : 'false');

    const prevChecked = this.#checked;

    this.#checked = newChecked ? [...this.#checked, item] : this.#checked.filter((i) => i !== item);

    if (isEqual(prevChecked, this.#checked)) {
      return;
    }

    this.control.emitter?.checked(this.#checked);
  }

  /**
   * Batch-toggle all items in the current selection range.
   * If any item in the selection is checked, uncheck all.
   * If none are checked, check all.
   */
  #batchToggleSelection(): void {
    const selection = this.#selectionStrategy?.selection.filter((item) =>
      this.#checkableItems.includes(item)
    );

    if (!selection || selection.length === 0) {
      return;
    }

    const anyChecked = selection.some((item) => item.getAttribute('aria-checked') === 'true');

    const prevChecked = this.#checked;

    if (anyChecked) {
      for (const item of selection) {
        item.setAttribute('aria-checked', 'false');
      }

      this.#checked = this.#checked.filter((item) => !selection.includes(item));
    } else {
      for (const item of selection) {
        item.setAttribute('aria-checked', 'true');
      }

      this.#checked = [...this.#checked.filter((item) => !selection.includes(item)), ...selection];
    }

    if (isEqual(prevChecked, this.#checked)) {
      return;
    }

    this.control.emitter?.checked(this.#checked);
  }
}
